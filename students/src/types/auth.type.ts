
export interface AuthState {
    token: string;
    expiresIn: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: "STUDENT"
    }
    setAuth: (auth: AuthState) => void;
    clearAuth: () => void;
}


// login
export interface LoginData {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    refreshToken: string;
    expireAt: string;
}

// signup
export type { SignupFormData } from "@schemas/auth.schema";
export interface SignupData {
    name: string;
    email: string;
    password: string;
}
export interface SignupResponse {
    token: string;
    refreshToken: string;
    expireAt: string;
}
