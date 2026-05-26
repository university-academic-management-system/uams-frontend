import type { UserProfile } from "@type/auth.type";
import type { Payment } from "@type/payment.type";
import { create } from "zustand";

export const useReceiptStore = create<{
    data: (Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">);
    init: (data: Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">) => void;
}>()((set) => ({
    data: {} as Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">,
    init: (data) => set({ data }),
}))