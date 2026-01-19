import api from "@/lib/api";

// src/types/permission.ts

export interface PermissionRequest {
  id: number;
  document: string;     // ⬅️ STRING
  action: "REPLACE" | "DELETE";
  status: "PENDING" | "APPROVED" | "REJECTED" | "PENDING_DELETE" | "PENDING_REPLACE";
  created_at: string;
  requester: string;    // ⬅️ STRING
  approved_by?: string;  // ⬅️ STRING
  approved_at?: string;
  // rejected_by?: string;  // ⬅️ STRING
  // rejected_at?: string;
  // rejection_reason?: string;

}


export const PermissionService = {
   getPending(): Promise<PermissionRequest[]> {
    return api.get("permissions").then(res => res.data);
  },

  approve(id: number) {
    return api.post(`permissions/${id}/approve/`);
  },

  reject(id: number) {
    return api.post(`permissions/${id}/reject/`);
  },

  getHistory(): Promise<PermissionRequest[]> {
    return api
      .get("permissions/admin/history/")
      .then(res => res.data);
  }

};
