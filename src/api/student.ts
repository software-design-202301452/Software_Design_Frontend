import api from './axios'
import type {
  StudentSummaryResponse,
  StudentDetailResponse,
  RegisterStudentRequest,
  UpdateStudentRequest,
  ApiResponse,
} from '../types'

export const studentApi = {
  registerStudent: (data: RegisterStudentRequest) =>
    api.post<ApiResponse<StudentSummaryResponse>>('/students', data),

  getStudents: (params?: { grade?: number; classNum?: number; studentNumber?: number }) =>
    api.get<ApiResponse<StudentSummaryResponse[]>>('/students', { params }),

  getStudentDetail: (studentId: number) =>
    api.get<ApiResponse<StudentDetailResponse>>(`/students/${studentId}`),

  updateStudent: (studentId: number, data: UpdateStudentRequest) =>
    api.put<ApiResponse<StudentSummaryResponse>>(`/students/${studentId}`, data),
}
