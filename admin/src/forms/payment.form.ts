import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentConfigSchema, type PaymentConfigData } from "@schemas/payment.schema";

export const usePaymentConfigForm = () => {
  return useForm<PaymentConfigData>({
    mode: "onChange",
    resolver: zodResolver(paymentConfigSchema),
    defaultValues: {
      paystack_public_key: "",
      paystack_secret_key: "",
      annual_access_fee: 0,
      annual_access_merchant_fee: 0,
      annual_access_split_key: "",
      department_annual_access_dues: 0,
      department_annual_access_merchant_fee: 0,
      department_annual_access_split_key: "",
      id_card_payment: 0,
      id_card_merchant_fee: 0,
      id_card_split_key: "",
      transcript_fee: 0,
      transcript_merchant_fee: 0,
      transcript_split_key: "",
      transcript_digital_fee: 0,
      transcript_digital_merchant_fee: 0,
      transcript_courier_fee: 0,
      transcript_courier_merchant_fee: 0,
      transcript_pickup_fee: 0,
      transcript_pickup_merchant_fee: 0
    }
  });
};
