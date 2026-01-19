import api from "@/lib/api";

export interface Profile {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const UserService = {
  getProfile(): Promise<Profile> {
    return api.get("me/").then((res) => res.data);
  },
};
