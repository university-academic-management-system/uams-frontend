import type { PaymentType } from "./registration.type";

export interface Payment {
    id: string;
    studentId: string;
    amount: string | number;
    reference: string;
    paymentChannel: string;
    type: PaymentType | string;
    session: string;
    level: string;
    semester: string;
    status: string;
    metadata: {
        level: string;
        userId: string;
        session: string;
        referrer: string;
        semester: string;
        studentId: string;
        paymentType: string;
        redirectUrl: string;
        authorization: {
            bin: string | null;
            bank: string | null;
            brand: string | null;
            last4: string | null;
            channel: string | null;
            exp_year: string | null;
            reusable: boolean;
            card_type: string | null;
            exp_month: string | null;
            narration: string | null;
            signature: string | null;
            sender_bank: string | null;
            sender_name: string | null;
            account_name: string | null;
            country_code: string | null;
            receiver_bank: string | null;
            sender_country: string | null;
            authorization_code: string | null;
            sender_bank_account_number: string | null;
            receiver_bank_account_number: string | null;
        };
        deliveryMethod: string;
        amountBreakdown: {
            extraFee: string;
            baseAmount: string;
            deliveryMethod: string;
            merchantAmount: string;
            transactionCharges: string;
            deliveryDescription: string;
        };
        transcriptRequestId: string;
        transcriptRequestReference: string;
    };
    createdAt: string;
    updatedAt: string;
    student?: {
        matricNumber: string;
        registrationNo: string;
        userId: string;
        firstName: string;
        surname: string;
        otherName: string;
    };
}

export interface PaymentResponse {
    status: string;
    message: string;
    data: Payment;
}
