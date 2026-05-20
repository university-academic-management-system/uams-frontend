import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema, type AnnouncementFormData } from "@schemas/announcement.schema";

const useAnnouncementForm = () => {
    return useForm<AnnouncementFormData>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            recipientType: "ALL",
            targetRole: [],
            type: "INFO",
            message: "",
        },
    });
};

export default useAnnouncementForm;
