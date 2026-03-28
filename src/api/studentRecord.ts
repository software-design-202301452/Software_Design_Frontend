import api from './axios'
import type {
  StudentRecordResponse,
  CreateStudentRecordRequest,
  UpdateStudentRecordRequest,
  ApiResponse,
} from '../types'

export const studentRecordApi = {
  createStudentRecord: (data: CreateStudentRecordRequest) =>
    api.post<ApiResponse<StudentRecordResponse>>('/student-records', data),

  updateStudentRecord: (recordId: number, data: UpdateStudentRecordRequest) =>
    api.put<ApiResponse<StudentRecordResponse>>(`/student-records/${recordId}`, data),

  getStudentRecords: (studentId: number) =>
    api.get<ApiResponse<StudentRecordResponse[]>>(`/student-records/student/${studentId}`),
}
