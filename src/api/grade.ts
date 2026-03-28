import api from './axios'
import type { GradeResponse, CreateGradeRequest, UpdateGradeRequest, ApiResponse } from '../types'

export const gradeApi = {
  createGrade: (data: CreateGradeRequest) =>
    api.post<ApiResponse<GradeResponse>>('/grades', data),

  updateGrade: (gradeId: number, data: UpdateGradeRequest) =>
    api.put<ApiResponse<GradeResponse>>(`/grades/${gradeId}`, data),

  deleteGrade: (gradeId: number) =>
    api.delete<ApiResponse<null>>(`/grades/${gradeId}`),

  getGradesByStudent: (studentId: number) =>
    api.get<ApiResponse<GradeResponse[]>>(`/grades/student/${studentId}`),

  getGradesByFilter: (
    studentId: number,
    params?: { subjectId?: number; year?: number; semester?: number }
  ) =>
    api.get<ApiResponse<GradeResponse[]>>(`/grades/student/${studentId}/filter`, { params }),
}
