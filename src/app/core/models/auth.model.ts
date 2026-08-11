export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailConfirmed: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}
