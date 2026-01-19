import api from "@/lib/api";

export const ApprovalService = {
  getPending() {
    return api.get("admin/approvals/").then((res) => res.data);
  },

  approve(id: number) {
    return api.post(`admin/approvals/${id}/approve/`);
  },

  reject(id: number) {
    return api.post(`admin/approvals/${id}/reject/`);
  },

  getHistory() {
    return api.get("admin/approvals/history/").then((res) => res.data);
  },
};
