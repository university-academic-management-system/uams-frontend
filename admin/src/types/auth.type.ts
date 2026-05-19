
// ── User profile from login response ────────────────────────────────

export interface UserProfile {
    type: string;
    departmentId: string;
    departmentName: string;
    departmentCode: string;
    facultyId: string;
    facultyName: string;
    facultyCode: string;
    assignedAt: string;
}

export interface UserUniversity {
    id: string;
    name: string;
    code: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

export interface UserDepartment {
    id: string;
    name: string;
    code: string;
    type: string;
    faculty: {
        id: string;
        name: string;
        code: string;
    };
}

export interface StaffProfile {
    id: string;
    userId: string;
    surname: string;
    firstName: string;
    otherName: string | null;
    staffNumber: string;
    phone: string | null;
    department: string;
    faculty: string;
    staffRoles: string[];
    title: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserData {
    id: string;
    email: string;
    name?: string; // Optional because /auth/me returns first/surname instead of 'name' at root
    role: string;
    roles?: string[];
    phone?: string | null;
    avatar?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    studentProfile?: any | null;
    staffProfile?: StaffProfile | null;
}

export interface ProfileResponse {
    status: string;
    message: string;
    data: UserData;
}

// ── Auth store state ────────────────────────────────────────────────

export interface AuthState {
    token: string;
    expiresIn: string;
    user: UserData | null;
    isAuthenticated: boolean;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}

// ── Login ────────────────────────────────────────────────────────────

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: {
        token: string;
        expiresIn: string;
        user: UserData;
    };
}

export interface UserSession {
    authData: LoginResponse | null;
    isLoggedIn: boolean;
}

export interface LoginProps {
    onLogin: (authData: LoginResponse) => void;
}
