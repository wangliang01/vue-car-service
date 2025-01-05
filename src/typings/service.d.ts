import type { ApiResponse, PageResult } from './common';

declare module '@/service/api/technician' {
  const getTechnicianList: (params: Api.Technician.SearchParams) => Promise<ApiResponse<PageResult<Api.Technician.TechnicianInfo>>>;
  const createTechnician: (data: Api.Technician.CreateParams) => Promise<ApiResponse<Api.Technician.TechnicianInfo>>>;
  const updateTechnician: (id: string, data: Api.Technician.UpdateParams) => Promise<ApiResponse<Api.Technician.TechnicianInfo>>>;
  const updateTechnicianStatus: (id: string, data: Api.Technician.UpdateStatusParams) => Promise<ApiResponse<Api.Technician.TechnicianInfo>>>;
  const deleteTechnician: (id: string) => Promise<ApiResponse<void>>>;
  const getTechnicianByUserId: (userId: string) => Promise<ApiResponse<Api.Technician.TechnicianInfo>>>;
  const getTechnicianById: (id: string) => Promise<ApiResponse<Api.Technician.TechnicianInfo>>>;
}

declare module '@/service/api/upload' {
  const uploadFile: (data: FormData) => Promise<ApiResponse<{ url: string }>>>;
}

declare module '@/store/modules/auth' {
  interface AuthState {
    userInfo: Api.Auth.UserInfo;
    token: string;
    refreshToken: string;
  }

  const useAuthStore: () => {
    userInfo: Api.Auth.UserInfo;
    token: string;
    refreshToken: string;
    login: (params: any) => Promise<void>;
    logout: () => Promise<void>;
  };
}

declare module '@/service/api/user' {
  export interface UserInfo {
    _id: string;
    id: string;
    username: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
    isAdmin: boolean;
    roles?: Array<{ _id: string; name: string; }>;
    createdAt: string;
  }

  export interface UserForm {
    username: string;
    name: string;
    phone: string;
    email: string;
    password?: string;
    type: 'admin' | 'user';
  }

  export const getUserList: (params: { page: number; limit: number; username?: string; name?: string; phone?: string; email?: string; }) => Promise<ApiResponse<PageResult<UserInfo>>>;
  export const createUser: (data: UserForm) => Promise<ApiResponse<UserInfo>>>;
  export const updateUser: (id: string, data: Partial<UserForm>) => Promise<ApiResponse<UserInfo>>>;
  export const deleteUser: (id: string) => Promise<ApiResponse<void>>>;
  export const getUserRoles: (userId: string) => Promise<ApiResponse<Array<{ _id: string; name: string; }>>>;
  export const updateUserRoles: (userId: string, roleIds: string[]) => Promise<ApiResponse<void>>>;
  export const searchUsers: (params: { keyword: string }) => Promise<ApiResponse<UserInfo[]>>;
} 