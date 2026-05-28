import type { UserProfile } from "@type/auth.type";
import type { Result } from "@type/course.type";
import type { Payment } from "@type/payment.type";
import { create } from "zustand";

export const useReceiptStore = create<{
    data: (Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">);
    init: (data: Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">) => void;
}>()((set) => ({
    data: {} as Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">,
    init: (data) => set({ data }),
}))



export const useCourseStatStore = create<{
    data: Result | null;
    init: (data: Result | null) => void;
}>()((set) => ({
    data: null,
    init: (data) => set({ data }),
}))


export const useResultStore = create<{
    type: "FIRST" | "SECOND" | "ALL";
    setType: (type: "FIRST" | "SECOND" | "ALL") => void;  
}>()((set) => ({
    type: "FIRST",
    setType: (type) => set({ type }),
}))