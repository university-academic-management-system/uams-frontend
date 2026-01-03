// export interface SubOrganization {
//   id: string;
//   name: string;
//   code: string;
//   type: "FACULTY" | "DEPARTMENT";
//   universityId: string;
//   parentId: string | null;
//   isActive: boolean;
// }

// export interface AccountRecord {
//   id?: string;
//   code: string;
//   role: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: "Active" | "Not Active" | "Pending" | "Not Certified" | "Certified";
// }
// // 

export interface SubOrganization {
  id: string;
  name: string;
  code: string;
  type: "FACULTY" | "DEPARTMENT";
  universityId: string;
  parentId: string | null;
  isActive: boolean;
}

export interface AccountRecord {
  id?: string;
  code: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Not Active" | "Pending" | "Not Certified" | "Certified";
}

// NEW: Authentication related interfaces
export interface AuthData {
  token: string;
  role: string;
  tenantId: string;
  universityId: string;
  facultyId: string | null;
  departmentId: string | null;
  email?: string;
  username?: string;
}

export interface UserSession {
  authData: AuthData | null;
  isLoggedIn: boolean;
}

// Keep old interface for backward compatibility if needed elsewhere
export interface OldUserSession {
  username: string;
  isLoggedIn: boolean;
}

export interface LoginPageProps {
  onLogin: (data: AuthData) => void;
}