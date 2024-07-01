export interface LoginForm {
  emailOrUsername: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ForgotForm {
  email: string
}

export interface ForgotResponse {
  emailSent: boolean
}

export interface RecoveryResponse {
  passwordChanged: boolean
}

export interface RecoveryForm {
  userId: string
  recoveryHash: string
  password: string
}

export interface ValidateRecoveryHashForm {
  userId: string
  hash: string
}

export interface ValidateRecoveryHashResponse {
  valid: boolean
}