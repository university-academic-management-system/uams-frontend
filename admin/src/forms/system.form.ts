import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemSettingsSchema, type SystemSettingsData } from "@schemas/system.schema";

export const useSystemSettingsForm = () => {
  return useForm<SystemSettingsData>({
    mode: "onChange",
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      caPercentage: 30,
      examPercentage: 70,
      siwesRequired: false,
      suspensionThreshold: 2,
      totalCreditUnit: 48,
      semester1CreditUnit: 24,
      semester2CreditUnit: 24,
    }
  });
};
