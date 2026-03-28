import api from './axios'
import type {
  CounselingResponse,
  CreateCounselingRequest,
  UpdateCounselingRequest,
  ApiResponse,
} from '../types'

export const counselingApi = {
  createCounseling: (data: CreateCounselingRequest) =>
    api.post<ApiResponse<CounselingResponse>>('/counselings', data),

  updateCounseling: (counselingId: number, data: UpdateCounselingRequest) =>
    api.put<ApiResponse<CounselingResponse>>(`/counselings/${counselingId}`, data),

  deleteCounseling: (counselingId: number) =>
    api.delete<ApiResponse<null>>(`/counselings/${counselingId}`),

  getCounselingsByStudent: (studentId: number) =>
    api.get<ApiResponse<CounselingResponse[]>>(`/counselings/student/${studentId}`),

  getSharedCounselings: () =>
    api.get<ApiResponse<CounselingResponse[]>>('/counselings/shared'),

  shareCounseling: (counselingId: number) =>
    api.patch<ApiResponse<CounselingResponse>>(`/counselings/${counselingId}/share`),

  unshareCounseling: (counselingId: number) =>
    api.patch<ApiResponse<CounselingResponse>>(`/counselings/${counselingId}/unshare`),
}
