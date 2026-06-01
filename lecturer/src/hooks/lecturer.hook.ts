import { StaffServices } from "@services/lecturer.service";
import { useQuery } from "@tanstack/react-query";

export const useStaff = () =>
  useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await StaffServices.getDepartmentLecturers();
      return response?.data || [];
    },
  });