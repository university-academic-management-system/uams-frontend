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
    }
  });
};
