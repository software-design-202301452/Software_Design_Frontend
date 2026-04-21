import api from './axios'
import type {
  StudentSummaryResponse,
  StudentDetailResponse,
  RegisterStudentRequest,
  UpdateStudentRequest,
  GradeResponse,
  FeedbackResponse,
  StudentRecordResponse,
  ApiResponse,
} from '../types'

export const studentApi = {
  registerStudent: (data: RegisterStudentRequest) =>
    api.post<ApiResponse<StudentSummaryResponse>>('/students', data),

  getStudents: (params?: { name?: string; grade?: number; classNum?: number; studentNumber?: number }) =>
    api.get<ApiResponse<StudentSummaryResponse[]>>('/students', { params }),

  getStudentDetail: (studentId: number) =>
    api.get<ApiResponse<StudentDetailResponse>>(`/students/${studentId}`),

  updateStudent: (studentId: number, data: UpdateStudentRequest) =>
    api.put<ApiResponse<StudentSummaryResponse>>(`/students/${studentId}`, data),

  // 학생 본인 전용 엔드포인트
  getMyGrades: () =>
    api.get<ApiResponse<GradeResponse[]>>('/student/my-grades'),

  getMyFeedbacks: () =>
    api.get<ApiResponse<FeedbackResponse[]>>('/student/my-feedbacks'),

  getMyRecords: () =>
    api.get<ApiResponse<StudentRecordResponse[]>>('/student/my-records'),
}
