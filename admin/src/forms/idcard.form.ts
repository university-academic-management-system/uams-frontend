import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { idCardSchema, type IDCardFormData } from "@schemas/idcard.schema";

export const useIDCardForm = () => {
  return useForm<IDCardFormData>({
    mode: "onChange",
    resolver: zodResolver(idCardSchema),
    defaultValues: {
      schoolName: "",
      faculty: "",
      department: "",
      schoolAddress: "",
      backDescription: "",
      backDisclaimer: "",
    }
  });
};
