export type TranscriptStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED" | "READY";
export type TranscriptDeliveryMethod = "DIGITAL_DELIVERY" | "COURIER_SERVICE" | "PHYSICAL_PICKUP";

export interface Transcript {
    id: string;
    reference: string;
    purpose: string;
    deliveryMethod: TranscriptDeliveryMethod;
    status: TranscriptStatus;
    address?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface TranscriptQueryParams {
    status?: TranscriptStatus;
    deliveryMethod?: TranscriptDeliveryMethod;
    page?: number;
    limit?: number;
}

export interface TranscriptsData {
    transcripts: Transcript[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface TranscriptsResponse {
    status: string;
    message: string;
    data: TranscriptsData;
}

export interface CreateTranscriptData {
    purpose: string;
    deliveryMethod: TranscriptDeliveryMethod;
    address: string;
}

export interface CreateTranscriptResponse {
    status: string;
    message: string;
    data: Transcript | null;
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
    type: PaymentType | string;
    deliveryMethod?: DeliveryMethod | string;
    baseAmount?: number;
    merchantFee: number;
    total: number;
    description?: string;
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
    data: PaymentDetails[];
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
