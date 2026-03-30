// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
export type GradeLevel = 'A' | 'B' | 'C' | 'D' | 'E'
export type FeedbackType = 'GRADE' | 'BEHAVIOR' | 'ATTENDANCE' | 'ATTITUDE' | 'GENERAL'
export type NotificationType =
  | 'GRADE_UPDATED'
  | 'FEEDBACK_PUBLISHED'
  | 'COUNSELING_UPDATED'
  | 'STUDENT_RECORD_UPDATED'
  | 'GENERAL'

// ─── Common ───────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  username: string
  name: string
  role: UserRole
}

export interface SignupTeacherRequest {
  username: string
  password: string
  name: string
  email: string
  teacherCode: string
  department?: string
  phone?: string
}

export interface SignupStudentRequest {
  username: string
  password: string
  name: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
}

export interface SignupStudentResponse {
  studentId: number
  name: string
  grade: number
  classNum: number
  studentNumber: number
  linkCode: string
}

export interface SignupParentRequest {
  username: string
  password: string
  name: string
  email: string
  studentLinkCode: string
  phone?: string
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface MyInfoResponse {
  id: number
  username: string
  name: string
  email: string
  role: UserRole
  phone?: string
  department?: string
  grade?: number
  classNum?: number
  studentNumber?: number
  address?: string
  studentName?: string
  studentGrade?: number
  studentClassNum?: number
}

export interface UpdateMyInfoRequest {
  department?: string
  phone?: string
  address?: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ─── Student ──────────────────────────────────────────────────────────────────
export interface StudentSummaryResponse {
  id: number
  name: string
  username: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
}

export interface StudentRecordSummary {
  id: number
  year: number
  semester: number
  recordDate: string
  attendanceDays: number
  absenceDays: number
  lateDays: number
  earlyLeaveDays: number
  specialNote?: string
  volunteerHours?: number
}

export interface StudentDetailResponse {
  id: number
  name: string
  username: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
  studentRecords: StudentRecordSummary[]
}

export interface RegisterStudentRequest {
  username: string
  password: string
  name: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
}

export interface UpdateStudentRequest {
  name: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export interface SubjectResponse {
  id: number
  name: string
  description?: string
}

export interface CreateSubjectRequest {
  name: string
  description?: string
}

// ─── Grade ────────────────────────────────────────────────────────────────────
export interface GradeResponse {
  id: number
  studentId: number
  studentName: string
  grade: number
  classNum: number
  studentNumber: number
  subjectId: number
  subjectName: string
  teacherId: number
  teacherName: string
  year: number
  semester: number
  score: number
  totalScore: number
  average: number
  gradeLevel: GradeLevel
  note?: string
}

export interface CreateGradeRequest {
  studentId: number
  subjectId: number
  year: number
  semester: number
  score: number
  totalScore: number
  note?: string
}

export interface UpdateGradeRequest {
  score: number
  totalScore: number
  note?: string
}

// ─── StudentRecord ────────────────────────────────────────────────────────────
export interface StudentRecordResponse {
  id: number
  studentId: number
  studentName: string
  grade: number
  classNum: number
  studentNumber: number
  teacherId: number
  teacherName: string
  year: number
  semester: number
  recordDate: string
  attendanceDays: number
  absenceDays: number
  lateDays: number
  earlyLeaveDays: number
  specialNote?: string
  volunteerHours?: number
}

export interface CreateStudentRecordRequest {
  studentId: number
  year: number
  semester: number
  recordDate: string
  attendanceDays: number
  absenceDays: number
  lateDays: number
  earlyLeaveDays: number
  specialNote?: string
  volunteerHours?: number
}

export interface UpdateStudentRecordRequest {
  attendanceDays: number
  absenceDays: number
  lateDays: number
  earlyLeaveDays: number
  specialNote?: string
  volunteerHours?: number
}

// ─── Counseling ───────────────────────────────────────────────────────────────
export interface CounselingResponse {
  id: number
  studentId: number
  studentName: string
  teacherId: number
  teacherName: string
  counselingDate: string
  content: string
  nextPlan?: string
  nextCounselingDate?: string
  shared: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCounselingRequest {
  studentId: number
  counselingDate: string
  content: string
  nextPlan?: string
  nextCounselingDate?: string
}

export interface UpdateCounselingRequest {
  content: string
  nextPlan?: string
  nextCounselingDate?: string
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
export interface FeedbackResponse {
  id: number
  studentId: number
  studentName: string
  teacherId: number
  teacherName: string
  feedbackType: FeedbackType
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateFeedbackRequest {
  studentId: number
  feedbackType: FeedbackType
  content: string
}

export interface UpdateFeedbackRequest {
  feedbackType: FeedbackType
  content: string
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export interface MyStudentResponse {
  studentId: number
  name: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface AccountSummary {
  id: number
  username: string
  name: string
  email: string
  role: UserRole
  extra?: string
}

export interface AccountListResponse {
  teachers: AccountSummary[]
  students: AccountSummary[]
  parents: AccountSummary[]
  admins: AccountSummary[]
}

export interface AdminCreateTeacherRequest {
  username: string
  password: string
  name: string
  email: string
  department?: string
  phone?: string
}

export interface AdminCreateStudentRequest {
  username: string
  password: string
  name: string
  email: string
  grade: number
  classNum: number
  studentNumber: number
  phone?: string
  address?: string
}

export interface AdminCreateParentRequest {
  username: string
  password: string
  name: string
  email: string
  studentLinkCode: string
  phone?: string
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface NotificationResponse {
  id: number
  receiverUsername: string
  receiverRole: UserRole
  notificationType: NotificationType
  message: string
  referenceId?: number
  isRead: boolean
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
export interface AuthUser {
  username: string
  name: string
  role: UserRole
  accessToken: string
}
