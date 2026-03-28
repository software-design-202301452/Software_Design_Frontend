import api from './axios'
import type {
  FeedbackResponse,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  ApiResponse,
} from '../types'

export const feedbackApi = {
  createFeedback: (data: CreateFeedbackRequest) =>
    api.post<ApiResponse<FeedbackResponse>>('/feedbacks', data),

  updateFeedback: (feedbackId: number, data: UpdateFeedbackRequest) =>
    api.put<ApiResponse<FeedbackResponse>>(`/feedbacks/${feedbackId}`, data),

  deleteFeedback: (feedbackId: number) =>
    api.delete<ApiResponse<null>>(`/feedbacks/${feedbackId}`),

  publishFeedback: (feedbackId: number) =>
    api.patch<ApiResponse<FeedbackResponse>>(`/feedbacks/${feedbackId}/publish`),

  unpublishFeedback: (feedbackId: number) =>
    api.patch<ApiResponse<FeedbackResponse>>(`/feedbacks/${feedbackId}/unpublish`),

  getFeedbacks: (params?: {
    studentId?: number
    teacherId?: number
    feedbackType?: string
    startDate?: string
    endDate?: string
  }) =>
    api.get<ApiResponse<FeedbackResponse[]>>('/feedbacks', { params }),
}
