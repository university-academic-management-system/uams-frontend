import axiosClient from "@configs/axios.config";
import type {
  ApiResponse,
  ResultUploadsResponse,
  UploadDraftPayload,
  RejectPayload,
  ResultUpload,
  TranscriptResponse,
} from "@type/result.type";

export const ResultService = {
  // Get academic transcript for a student (ERO/Admin)
  getTranscript: async (studentId: string): Promise<TranscriptResponse> => {
    const { data } = await axiosClient.get<ApiResponse<TranscriptResponse>>(
      `/results/transcript/${studentId}`
    );
    return data.data;
  },

  // Upload draft results (Lecturer)
  uploadDraftResults: async (payload: UploadDraftPayload): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("courseId", payload.courseId);
    formData.append("session", payload.session);
    formData.append("semester", payload.semester);
    formData.append("level", payload.level);
    formData.append("file", payload.file);

    const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
      "/results/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.data;
  },

  // Download draft results file (ERO/Admin)
  downloadDraftResults: async (resultUploadId: string): Promise<{ downloadUrl: string }> => {
    const { data } = await axiosClient.get<ApiResponse<{ downloadUrl: string }>>(
      `/results/${resultUploadId}/download`
    );
    return data.data;
  },

  // Reject draft results (ERO/Admin)
  rejectDraftResults: async (resultUploadId: string, payload: RejectPayload): Promise<{ message: string }> => {
    const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
      `/results/${resultUploadId}/reject`,
      payload
    );
    return data.data;
  },

  // Upload final approved results (ERO/Admin)
  uploadFinalResults: async (resultUploadId: string, file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosClient.post<ApiResponse<{ message: string }>>(
      `/results/${resultUploadId}/final-upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.data;
  },

  // Get all pending results (ERO/Admin)
  getPendingResults: async (): Promise<ResultUpload[]> => {
    const { data } = await axiosClient.get<ResultUploadsResponse>("/results/pending");
    return data.data;
  },

  // Get all approved results (ERO/Admin) with optional filters
  getApprovedResults: async (session?: string, semester?: string): Promise<ResultUpload[]> => {
    const params: Record<string, string> = {};
    if (session) params.session = session;
    if (semester) params.semester = semester;

    const { data } = await axiosClient.get<ResultUploadsResponse>("/results/approved", { params });
    return data.data;
  },
};