import axiosInstance from './axios'
import type { ApiResponse, NotificationResponse, UnreadCountResponse } from '../types'

export const notificationApi = {
  /** CEW-61: 내 알림 목록 조회 */
  getMyNotifications: () =>
    axiosInstance.get<ApiResponse<NotificationResponse[]>>('/api/v1/notifications'),

  /** 미읽음 수 조회 (폴링용) */
  getUnreadCount: () =>
    axiosInstance.get<ApiResponse<UnreadCountResponse>>('/api/v1/notifications/unread-count'),

  /** CEW-62: 단건 읽음 처리 */
  markAsRead: (id: number) =>
    axiosInstance.patch<ApiResponse<void>>(`/api/v1/notifications/${id}/read`),

  /** 전체 읽음 처리 */
  markAllAsRead: () =>
    axiosInstance.patch<ApiResponse<void>>('/api/v1/notifications/read-all'),
}
