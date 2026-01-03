import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { AccountRecord } from "./types";

export const EditAdminModal = ({
  admin,
  onClose,
  onUpdate,
}: {
  admin: AccountRecord;
  onClose: () => void;
  onUpdate: (r: AccountRecord) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(admin.name);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add logic here to call PATCH API
    onUpdate({ ...admin, name });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#1b75d0] font-bold text-xl">Edit Admin</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b75d0] text-white py-2 rounded-lg font-bold"
          >
            {loading ? (
              <Loader2 className="animate-spin inline" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
