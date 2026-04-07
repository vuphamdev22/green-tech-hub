import axiosClient from "@/api/axiosClient";
import type { AdminUser } from "@/types/user";

export const getAdminUsers = () => axiosClient.get<AdminUser[]>("/admin/users");
export const getAdminUser = (id: number) => axiosClient.get<AdminUser>(`/admin/users/${id}`);
export const updateAdminUser = (id: number, payload: Partial<AdminUser>) => axiosClient.put<AdminUser>(`/admin/users/${id}`, payload);
export const setAdminUserEnabled = (id: number, enabled: boolean) => axiosClient.put<AdminUser>(`/admin/users/${id}/status?enabled=${enabled}`);
export const deleteAdminUser = (id: number) => axiosClient.delete<void>(`/admin/users/${id}`);

export type { AdminUser };
