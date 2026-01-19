import api from "@/lib/api";

export const DashboardService = {
  getStats() {
    return api.get("dashboard/").then((res) => res.data);
  },
};
