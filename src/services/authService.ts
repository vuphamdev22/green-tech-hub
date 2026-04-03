import axiosClient from "@/api/axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

const authService = {
  login: (data: LoginPayload) => axiosClient.post("/auth/login", data),

  register: (data: RegisterPayload) => axiosClient.post("/auth/register", data),

  logout: () => axiosClient.post("/auth/logout"),
};

export default authService;
