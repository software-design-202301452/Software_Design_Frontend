import api from './axios'
import type { ApiResponse } from '../types'

export interface TeacherDashboardResponse {
  totalStudents: number
  totalGrades: number
  unpublishedFeedbacks: number
  recentCounselingsCount: number
  recentCounselings: {
    id: number
    studentName: string
    teacherName: string
    counselingDate: string
    content: string
  }[]
  recentFeedbacks: {
    id: number
    studentName: string
    teacherName: string
    feedbackType: string
    content: string
    published: boolean
    createdAt: string
  }[]
  recentGrades: {
    id: number
    studentName: string
    subjectName: string
    year: number
    semester: number
    score: number
    gradeLevel: string
    createdAt: string
  }[]
}

export const dashboardApi = {
  getTeacherDashboard: () =>
    api.get<ApiResponse<TeacherDashboardResponse>>('/dashboard/teacher'),
}
