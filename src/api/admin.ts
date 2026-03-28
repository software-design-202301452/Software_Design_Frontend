import api from './axios'
import type {
  AccountListResponse,
  AdminCreateTeacherRequest,
  AdminCreateStudentRequest,
  AdminCreateParentRequest,
  ApiResponse,
} from '../types'

export const adminApi = {
  getAllAccounts: () =>
    api.get<ApiResponse<AccountListResponse>>('/admin/accounts'),

  createTeacher: (data: AdminCreateTeacherRequest) =>
    api.post<ApiResponse<null>>('/admin/accounts/teacher', data),

  createStudent: (data: AdminCreateStudentRequest) =>
    api.post<ApiResponse<null>>('/admin/accounts/student', data),

  createParent: (data: AdminCreateParentRequest) =>
    api.post<ApiResponse<null>>('/admin/accounts/parent', data),
}
