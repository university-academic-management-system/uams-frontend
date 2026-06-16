export interface AuthState {
    token: string;
    expiresIn: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        roles?: string[];
    }
    setAuth: (auth: AuthState) => void;
    clearAuth: () => void;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    expireAt: string;
}

export interface UpdateContactPayload {
    email?: string;
    phone?: string;
}

export interface UpdateContactResponse {
    status: string;
    message: string;
    data: string;
}

export interface ChangePasswordPayload {
    currentPassword?: string;
    newPassword?: string;
}

export interface ChangePasswordResponse {
    status: string;
    message: string;
    data: string;
}

export interface ProfileResponse {
    status: string;
    message: string;
    data: UserData;
}

export interface staffProfile {
        id: string;
        userId: string;
        firstName: string;
        surname: string;
        otherName?: string;
        staffNumber: string;
        phone: string | null;
        faculty: string;
        department: string;
        staffRoles: string[];
        title: string;
        gender: string;
        createdAt: string;
        updatedAt: string;
}

export interface UserData {
        id: string;
        email: string;
        role: string;
        status: string;
        passwordResetToken: string | null;
        passwordResetTokenExpiry: string | null;
        createdAt: string;
        updatedAt: string;
        studentProfile: null;
        staffProfile: staffProfile | null;
}

