import { z } from "zod";

export const paymentConfigSchema = z.object({
  paystack_public_key: z.string().min(1,"Paystack public key is required"),
  paystack_secret_key: z.string().min(1,"Paystack secret key is required"),
  annual_access_fee: z.number().min(0,"Annual access fee is required"),
  annual_access_merchant_fee: z.number().min(0,"Annual access merchant fee is required"),
  annual_access_split_key: z.string().optional(),
  department_annual_access_dues: z.number().min(0).optional(),
  department_annual_access_merchant_fee: z.number().min(0).optional(),
  department_annual_access_split_key: z.string().optional(),
  id_card_payment: z.number().min(0).optional(),
  id_card_merchant_fee: z.number().min(0).optional(),
  id_card_split_key: z.string().optional(),
  transcript_fee: z.number().min(0).optional(),
  transcript_merchant_fee: z.number().min(0).optional(),
  transcript_split_key: z.string().optional(),
  transcript_digital_fee: z.number().min(0).optional(),
  transcript_digital_merchant_fee: z.number().min(0).optional(),
  transcript_courier_fee: z.number().min(0).optional(),
  transcript_courier_merchant_fee: z.number().min(0).optional(),
  transcript_pickup_fee: z.number().min(0).optional(),
  transcript_pickup_merchant_fee: z.number().min(0).optional()
})

export type PaymentConfigData = z.infer<typeof paymentConfigSchema>;