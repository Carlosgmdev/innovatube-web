export interface LoginForm {
  email: string
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