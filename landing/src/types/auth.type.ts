import type React from 'react';

// @type/auth.type.ts
export interface Profile {
    firstName: string;
    surname: string;
    otherName: string | null;
    matricNumber: string;
    registrationNo: string;
    gender: string;
    phone: string | null;
    email: string | null;
    faculty: string;
    department: string;
    level: string;
    admissionMode: string;
    entryQualification: string;
    degreeAwarded: string;
    programme: string;
}

export interface User {
    id?: string;
    role?: string;
    roles?: string[];
    email?: string;
    name?: string;
    [key: string]: unknown;
    profile?: Profile;
}

export interface AuthState {
    token: string;
    refreshToken?: string;
    expireAt: string;
    user?: User;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface LoginResponse {
    status: string;
    message?: string;
    data: {
        token: string;
        expiresIn: string;
        user: User;
    };
}

export interface VerifyStudentResponse {
    status: string;
    message?: string;
    data: {
        verificationToken: string;
        profile: Profile;
    };
}

export interface ActivateAccountRequest {
  token: string;
  email: string;
  phone: string;
  password: string;
}

export interface ActivateAccountResponse {
  status: string;
  message: string;
  data: {
    token: string;
    expiresIn: string;
    user: User;
  };
}

export interface InitializePaymentRequest {
  type: PaymentType;
  redirectUrl: string;
  [key: string]: unknown;
}

export interface InitializePaymentResponse {
  status: string;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export enum PaymentType {
  ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES = "ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES",
  TRANSCRIPT_REQUEST_FEE = "TRANSCRIPT_REQUEST_FEE",
  ID_CARD_FEE = "ID_CARD_FEE",
  SIWES_FEE = "SIWES_FEE",
}

export enum DeliveryMethod {
  DIGITAL_DELIVERY = "DIGITAL_DELIVERY",
  COURIER_SERVICE = "COURIER_SERVICE",
  PHYSICAL_PICKUP = "PHYSICAL_PICKUP",
}

export interface PaymentDetails {
  type: PaymentType;
  total: number;
  merchantFee: number;
  annualAccessFee?: number;
  annualDepartmentalDues?: number;
  transcriptFee?: number;
  idCardFee?: number;
  siwesFee?: number;
  [key: string]: unknown;
}

export interface PaymentDetailsResponse {
  status: string;
  message: string;
  data: PaymentDetails;
}

export interface DepartmentDuesResponse {
  status: string;
  message: string;
  data: {
    type: PaymentType.ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES;
    annualAccessFee: number;
    annualDepartmentalDues: number;
    merchantFee: number;
    total: number;
  };
}

export interface IdCardFeeResponse {
  success: boolean;
  data: {
    idCardFee: number;
    merchant_fee: number;
    transaction_charges: number;
    subtotal: number;
  };
}

export interface ConfirmIdCardPaymentResponse {
  success: boolean;
  transaction: {
    id: string;
    reference: string;
    student_id: string;
    student_reg_number: string;
    student_name: string;
    payment_for: string;
    amount: string;
    currency: string;
    status: string;
    paid_at: string;
  };
}

export interface ResetPasswordData {
    email: string;
    token: string;
    password?: string;
}

// Form Data Types


// Component Prop Types
export interface ActivateAccountStepProps {
    onNext: () => void;
    onForgotPassword: () => void;
}

export interface ForgotPasswordFlowProps {
    onBackToLogin: () => void;
}

export type RecoveryStep = 'forgot-password' | 'verify-code' | 'reset-password' | 'reset-success';

export interface PaymentStepProps {
    onNext: () => void;
}

export interface RegNumberStepProps {
    onNext: () => void;
}

export interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
    isPlainLogo?: boolean;
}

export type { LoginFormData, ActivateAccountFormData, ForgotPasswordFormData, OtpFormData, ResetPasswordFormData, VerifyStudentFormData } from "@schemas/auth.schema"