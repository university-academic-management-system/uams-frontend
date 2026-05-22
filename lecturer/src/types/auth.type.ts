// @type/auth.type.ts
export interface User {
    id?: string;
    role?: string;
    roles?: string[];
    email?: string;
    name?: string;
    currentSession?: string;  
    currentSemester?: string;
    [key: string]: any;
}

export interface ProfileResponse {
    status: string;
    message: string;
    data: UserData;
}

export interface UserData {
    id: string;
    staffProfile: {
        userId: string;
        title: string;
        firstName: string;
        surname: string;
        otherName?: string;
        staffNumber: string;
        phone: string | null;
        gender: string;
        staffRoles: string[];
        faculty: string;
        department: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface AuthState {
    token: string;
    refreshToken?: string;
    expireAt: string;
    user?: User;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}