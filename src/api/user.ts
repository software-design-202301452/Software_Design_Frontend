import api from './axios'
import type { MyInfoResponse, UpdateMyInfoRequest, UpdatePasswordRequest, ApiResponse } from '../types'

export const userApi = {
  getMyInfo: () =>
    api.get<ApiResponse<MyInfoResponse>>('/users/me'),

  updateMyInfo: (data: UpdateMyInfoRequest) =>
    api.put<ApiResponse<MyInfoResponse>>('/users/me', data),

  updatePassword: (data: UpdatePasswordRequest) =>
    api.put<ApiResponse<null>>('/users/me/password', data),
}
