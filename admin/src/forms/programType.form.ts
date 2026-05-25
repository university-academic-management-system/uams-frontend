import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramTypeSchema, type ProgramTypeFormData } from "../schemas/program.schema";

const useProgramTypeForm = (defaultValues?: Partial<ProgramTypeFormData>) => {
    return useForm<ProgramTypeFormData>({
        mode: "onChange",
        resolver: zodResolver(ProgramTypeSchema),
        defaultValues: {
            name: "",
            code: "",
            type: "",
            description: "",
            ...defaultValues
        }
    });
};

export default useProgramTypeForm;
