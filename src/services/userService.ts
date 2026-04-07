import axiosClient from "@/api/axiosClient";
import type { UserProfile } from "@/types/user";

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const userService = {
  getProfile: () => axiosClient.get<UserProfile>("/users/me"),
  updateProfile: (payload: UpdateProfileRequest) => axiosClient.put<UserProfile>("/users/me", payload),
  changePassword: (payload: ChangePasswordRequest) => axiosClient.put<string>("/users/change-password", payload),
};

export default userService;
