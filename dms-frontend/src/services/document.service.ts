import api from "@/lib/api";

export type DocumentStatus =
  | "ACTIVE"
  | "PENDING_DELETE"
  | "PENDING_REPLACE"
  | "APPROVED"
  | "REJECTED";

export interface Document {
  id: number;
  title: string;
  // file: string;
  description?: string;
  documentType: string
  fileUrl: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  version: number
  status: DocumentStatus;
  createdBy?: {
    id: number
    username: string
    role?: string
  }
  createdAt: string;

  user_id: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export const DocumentService = {
  getAll(status?: string): Promise<PaginatedResponse<Document>> {
    const params: any = {};
    if (status && status !== "all") {
      params.status = status;
    }
    return api.get("documents/").then((res) => res.data);
  },

  upload(formData: FormData) {
    return api.post("documents/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getById(id: number) {
    return api.get(`documents/${id}/`).then((res) => res.data);
  },

  requestReplace(id: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/documents/${id}/request-replace/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    });
  },

  requestDelete(id: number) {
    return api.post(`/documents/${id}/request-delete/`);
  },
};
