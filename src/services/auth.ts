// 인증 관련 서비스
import { memberAPI } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  nickname: string;
  email: string;
  phone_number: string;
  birth_date: string;
  password: string;
  policy_agree_1: boolean;
  policy_agree_2: boolean;
}

export interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  phone_number: string;
  birth_date: string;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 로그인
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: { access_token: string; refresh_token: string } }> {
    try {
      const response = await memberAPI.login(credentials);
      
      // 토큰을 로컬 스토리지에 저장
      this.setTokens(response.access_token, response.refresh_token);
      
      return {
        user: response.user,
        tokens: {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        },
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  }

  // 회원가입
  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await memberAPI.register(userData);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  }

  // 로그아웃
  logout(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  // 토큰 저장
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // 토큰 제거
  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // 액세스 토큰 가져오기
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // 리프레시 토큰 가져오기
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // 로그인 상태 확인
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // 토큰 새로고침
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    try {
      const response = await memberAPI.refreshToken(refreshToken);
      localStorage.setItem('accessToken', response.access_token);
      return response.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  // 사용자 정보 가져오기
  async getCurrentUser(): Promise<User> {
    try {
      const response = await memberAPI.getProfile();
      return response as User;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }
}