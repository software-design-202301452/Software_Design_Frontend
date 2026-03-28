import api from './axios'
import type { SubjectResponse, CreateSubjectRequest, ApiResponse } from '../types'

export const subjectApi = {
  createSubject: (data: CreateSubjectRequest) =>
    api.post<ApiResponse<SubjectResponse>>('/subjects', data),

  getAllSubjects: () =>
    api.get<ApiResponse<SubjectResponse[]>>('/subjects'),
}
