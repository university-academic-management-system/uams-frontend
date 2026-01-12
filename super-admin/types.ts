export interface University {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  slug?: string;
  created_at?: string;
}

export interface Subscription {
  id: string;
  universityName: string;
  planPrice: number;
  status: 'Active' | 'Inactive' | 'Ending Soon';
  dueDate: string;
  daysRemaining?: number;
}

export interface RolePermission {
  id: string;
  roleName: string; // e.g., HOD, Class Rep, Dean
  description: string;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  active: boolean;
}
