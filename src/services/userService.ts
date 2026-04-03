import axiosClient from "@/api/axiosClient";
import type { UserProfile } from "@/types/user";

const userService = {
  getProfile: () => axiosClient.get<UserProfile>("/users/me"),
};

export default userService;
