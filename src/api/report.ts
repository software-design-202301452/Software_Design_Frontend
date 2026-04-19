import api from './axios'
import type {
  ApiResponse,
  GradeReportResponse,
  CounselingReportResponse,
  FeedbackReportResponse,
} from '../types'

export const reportApi = {
  getGradeReport: (studentId: number) =>
    api.get<ApiResponse<GradeReportResponse>>(`/reports/grades/${studentId}`),

  getCounselingReport: (studentId: number) =>
    api.get<ApiResponse<CounselingReportResponse>>(`/reports/counselings/${studentId}`),

  getFeedbackReport: (studentId: number) =>
    api.get<ApiResponse<FeedbackReportResponse>>(`/reports/feedbacks/${studentId}`),
}
