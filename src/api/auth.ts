import api from './axios'
import type {
  LoginRequest,
  LoginResponse,
  SignupTeacherRequest,
  SignupStudentRequest,
  SignupStudentResponse,
  SignupParentRequest,
  ApiResponse,
} from '../types'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  signupTeacher: (data: SignupTeacherRequest) =>
    api.post<ApiResponse<null>>('/auth/signup/teacher', data),

  signupStudent: (data: SignupStudentRequest) =>
    api.post<ApiResponse<SignupStudentResponse>>('/auth/signup/student', data),

  signupParent: (data: SignupParentRequest) =>
    api.post<ApiResponse<null>>('/auth/signup/parent', data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
}
