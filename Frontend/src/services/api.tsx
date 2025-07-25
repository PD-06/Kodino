const API_BASE_URL = 'http://localhost:8000';

export interface PythonExecutionResult {
  output: string;
  feedback: string;
  status: 'success' | 'error';
  error?: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  hasEmail: boolean;
  email?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  nama_panjang: string;
  username: string;
  email?: string;
  progress?: {
    level: number;
    pengalaman: number;
    total_koin: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  user?: T;
  error?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getUsers(): Promise<User[]> {
    const response = await this.makeRequest<User[]>('/users');
    return response as any; // The users endpoint returns array directly
  }

  async getUserById(userId: string): Promise<User> {
    const response = await this.makeRequest<User>(`/users/${userId}`);
    return response as any; // The user endpoint returns user directly
  }

  /**
   * Execute Python code and get the result
   * @param code Python code to execute
   * @returns Promise with the execution result
   */
  async executePythonCode(code: string): Promise<PythonExecutionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/execute-python`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to execute code');
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing Python code:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();

export { API_BASE_URL };