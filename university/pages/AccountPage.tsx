import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import api from "../api/axios";
import { AccountRecord } from "../components/types";
import { AccountsTable } from "../components/AccountsTable";
import { AdminProfile } from "../components/AdminProfile";
import { CreateAdminModal } from "../components/CreateAdminModal";
import { EditAdminModal } from "../components/EditAdminModal";

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingAdmin, setViewingAdmin] = useState<AccountRecord | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AccountRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/university-admin/users");
        // Ensure we are accessing the correct array from your response
        const usersArray = res.data.users || [];

        const mappedData: AccountRecord[] = usersArray
          .filter((u: any) => u.role !== "STUDENT")
          .map((u: any) => ({
            code: u.id,
            role: u.role,
            name: u.fullName || "N/A",
            email: u.email,
            phone: u.phone || "—",
            status: u.isActive ? "active" : "inactive",
          }));
        setAccounts(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Use useMemo to prevent creating a new array reference every render
  const filtered = useMemo(() => {
    return accounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  if (viewingAdmin) {
    return (
      <AdminProfile admin={viewingAdmin} onBack={() => setViewingAdmin(null)} />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Admin</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#1b75d0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Create Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500 font-medium">
          Loading records...
        </div>
      ) : (
        <AccountsTable
          data={filtered}
          onView={setViewingAdmin}
          onEdit={setEditingAdmin}
          onDelete={(code) =>
            setAccounts((prev) => prev.filter((a) => a.code !== code))
          }
        />
      )}

      {isCreateOpen && (
        <CreateAdminModal
          onClose={() => setIsCreateOpen(false)}
          onSave={(nr) => setAccounts((prev) => [nr, ...prev])}
        />
      )}

      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onUpdate={(updated) =>
            setAccounts((prev) =>
              prev.map((a) => (a.code === updated.code ? updated : a))
            )
          }
        />
      )}
    </div>
  );
};

export default AccountsPage;

// import React, { useState, useEffect } from "react";
// import { Search, Plus } from "lucide-react";
// import api from "../api/axios"; // Adjust path to your axios file
// import { AccountRecord } from "../components/types";
// import { AccountsTable } from "../components/AccountsTable";
// import { AdminProfile } from "../components/AdminProfile";
// import { CreateAdminModal } from "../components/CreateAdminModal";
// import { EditAdminModal } from "../components/EditAdminModal";

// const AccountsPage: React.FC = () => {
//   const [accounts, setAccounts] = useState<AccountRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewingAdmin, setViewingAdmin] = useState<AccountRecord | null>(null);
//   const [editingAdmin, setEditingAdmin] = useState<AccountRecord | null>(null);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/university-admin/users");
//         // Filter out STUDENTS and map to our AccountRecord type
//         const filteredData: AccountRecord[] = res.data.users
//           .filter((u: any) => u.role !== "STUDENT")
//           .map((u: any) => ({
//             code: u.id,
//             role: u.role,
//             name: u.fullName || "N/A",
//             email: u.email,
//             phone: u.phone || "—",
//             status: u.isActive ? "active" : "inactive",
//           }));
//         setAccounts(filteredData);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const filtered = accounts.filter((acc) =>
//     acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     acc.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (viewingAdmin)
//     return (
//       <AdminProfile admin={viewingAdmin} onBack={() => setViewingAdmin(null)} />
//     );

//   return (
//     <div className="space-y-6 p-4 md:p-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-2xl font-bold text-slate-800">Admin</h2>
//         <div className="flex items-center gap-4 w-full sm:w-auto">
//           <div className="relative flex-1 sm:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => setIsCreateOpen(true)}
//             className="bg-[#1b75d0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-blue-700"
//           >
//             <Plus className="w-4 h-4" /> Create Admin
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="p-10 text-center text-slate-500 font-medium">Loading records...</div>
//       ) : (
//         <AccountsTable
//           data={filtered}
//           onView={setViewingAdmin}
//           onEdit={setEditingAdmin}
//           onDelete={(code) =>
//             setAccounts(accounts.filter((a) => a.code !== code))
//           }
//         />
//       )}

//       {isCreateOpen && (
//         <CreateAdminModal
//           onClose={() => setIsCreateOpen(false)}
//           onSave={(nr) => setAccounts([nr, ...accounts])}
//         />
//       )}

//       {editingAdmin && (
//         <EditAdminModal
//           admin={editingAdmin}
//           onClose={() => setEditingAdmin(null)}
//           onUpdate={(updated) =>
//             setAccounts(
//               accounts.map((a) => (a.code === updated.code ? updated : a))
//             )
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default AccountsPage;

// import React, { useState } from "react";
// import { Search, Plus } from "lucide-react";
// import { AccountRecord } from "../components/types";
// import { StatusBadge } from "../components/StatusBadge";
// import { AccountsTable } from "../components/AccountsTable";
// import { AdminProfile } from "../components/AdminProfile";
// import { CreateAdminModal } from "../components/CreateAdminModal";
// import { EditAdminModal } from "../components/EditAdminModal";

// const initialAccountsData: AccountRecord[] = [
//   {
//     code: "UNI-001",
//     role: "Department Admin",
//     name: "Computer Science",
//     email: "admin@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Active",
//   },
//   {
//     code: "UNI-002",
//     role: "Faculty Admin",
//     name: "Dr. Sarah Johnson",
//     email: "sarah@test.com",
//     phone: "08098765432",
//     status: "Active",
//   },
// ];

// const AccountsPage: React.FC = () => {
//   const [accounts, setAccounts] =
//     useState<AccountRecord[]>(initialAccountsData);
//   const [viewingAdmin, setViewingAdmin] = useState<AccountRecord | null>(null);
//   const [editingAdmin, setEditingAdmin] = useState<AccountRecord | null>(null);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const filtered = accounts.filter((acc) =>
//     acc.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (viewingAdmin)
//     return (
//       <AdminProfile admin={viewingAdmin} onBack={() => setViewingAdmin(null)} />
//     );

//   return (
//     <div className="space-y-6 p-4 md:p-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-2xl font-bold text-slate-800">Admin</h2>
//         <div className="flex items-center gap-4 w-full sm:w-auto">
//           <div className="relative flex-1 sm:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
//               placeholder="Search..."
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => setIsCreateOpen(true)}
//             className="bg-[#1b75d0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-blue-700"
//           >
//             <Plus className="w-4 h-4" /> Create Admin
//           </button>
//         </div>
//       </div>

//       <AccountsTable
//         data={filtered}
//         onView={setViewingAdmin}
//         onEdit={setEditingAdmin}
//         onDelete={(code) =>
//           setAccounts(accounts.filter((a) => a.code !== code))
//         }
//       />

//       {isCreateOpen && (
//         <CreateAdminModal
//           onClose={() => setIsCreateOpen(false)}
//           onSave={(nr) => setAccounts([nr, ...accounts])}
//         />
//       )}

//       {editingAdmin && (
//         <EditAdminModal
//           admin={editingAdmin}
//           onClose={() => setEditingAdmin(null)}
//           onUpdate={(updated) =>
//             setAccounts(
//               accounts.map((a) => (a.code === updated.code ? updated : a))
//             )
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default AccountsPage;
