export interface LoginBody {
  email: string
  password: string
  verificationCode?: string
}

export interface UpdatePwd {
  password: string
  newPassword: string
  verificationCode?: string
}
