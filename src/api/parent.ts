import api from './axios'
import type { MyStudentResponse, GradeResponse, FeedbackResponse, ApiResponse } from '../types'

export const parentApi = {
  getMyStudent: () =>
    api.get<ApiResponse<MyStudentResponse>>('/parent/my-student'),

  getStudentGrades: () =>
    api.get<ApiResponse<GradeResponse[]>>('/parent/student-grades'),

  getStudentFeedbacks: () =>
    api.get<ApiResponse<FeedbackResponse[]>>('/parent/student-feedbacks'),
}
