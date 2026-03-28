import api from './axios'
import type { MyStudentResponse, ApiResponse } from '../types'

export const parentApi = {
  getMyStudent: () =>
    api.get<ApiResponse<MyStudentResponse>>('/parent/my-student'),
}
