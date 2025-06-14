export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role: string;
}

export interface ApiResponse<T> {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: T;
}

export interface AuthResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      role: string;
    };
  };
}
