
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

// update contact
export interface UpdateContactPayload {
    email?: string;
    phone?: string;
}

export interface UpdateContactResponse {
    status: string;
    message: string;
    data: string;
}

// change password
export interface ChangePasswordPayload {
    currentPassword?: string;
    newPassword?: string;
}

export interface ChangePasswordResponse {
    status: string;
    message: string;
    data: string;
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

// me
export interface StudentProfile {
    id: string;
    userId: string;
    surname: string;
    firstName: string;
    otherName: string;
    matricNumber: string;
    registrationNo: string;
    phone: string;
    gender: string;
    level: string;
    admissionYear: number;
    admissionSession: string;
    currentSession: string;
    admissionMode: string;
    entryQualification: string;
    degreeAwarded: string;
    degreeAwardedCode: string;
    degreeCourse: string;
    degreeDuration: string;
    faculty: string;
    department: string;
    registrationStatus: string;
    googleAccessToken: string | null;
    googleRefreshToken: string | null;
    googleTokenExpiry: string | null;
    googleEmail: string | null;
    academicStanding: string;
    totalCreditsEarned: number;
    totalCreditsAttempted: number;
    cgpa: number | null;
    gpa: number | null;
    sgpa: number | null;
    carryoverCourses: number;
    probationCount: number;
    isOnProbation: boolean;
    isSuspended: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    email: string;
    role: string;
    status: string;
    passwordResetToken: string | null;
    passwordResetExpires: string | null;
    createdAt: string;
    updatedAt: string;
    studentProfile: StudentProfile | null;
    staffProfile: null;
}

export interface MeResponse {
    status: string;
    message: string;
    data: UserProfile;
}
