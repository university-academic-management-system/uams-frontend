export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
};

export type AuthPermissions = string[];

export interface UserState {
    user: AuthUser | null;
    permissions: AuthPermissions | null;
}

export interface UserActions {
    setUser: (user: AuthUser, permissions: AuthPermissions) => void;
    clearUser: () => void;
}