import axiosClient from "@/api/axiosClient";

export interface AdminCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE";
  productCount?: number;
}

export interface CategoryManagementPayload {
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export const getAdminCategories = () => {
  return axiosClient.get<AdminCategory[]>("/admin/categories");
};

export const getAdminCategory = (id: number) => {
  return axiosClient.get<AdminCategory>(`/admin/categories/${id}`);
};

export const createAdminCategory = (payload: CategoryManagementPayload) => {
  return axiosClient.post<AdminCategory>("/admin/categories", payload);
};

export const updateAdminCategory = (id: number, payload: CategoryManagementPayload) => {
  return axiosClient.put<AdminCategory>(`/admin/categories/${id}`, payload);
};

export const deleteAdminCategory = (id: number) => {
  return axiosClient.delete(`/admin/categories/${id}`);
};
