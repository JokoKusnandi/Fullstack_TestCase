import api from "@/lib/api";

export const NotificationService = {
  getAll() {
    return api.get("notifications/").then((res) => res.data);
  },

  markAsRead(id: number) {
    return api.post(`notifications/${id}/read/`);
  },
};
