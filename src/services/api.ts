// API 기본 설정 및 서비스
// Railway 내부 URL(.railway.internal)은 브라우저에서 접근 불가하므로 외부 URL로 대체
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    console.warn('Railway internal URL detected, using public URL instead');
    return 'https://fastapi-backend-production-2cd0.up.railway.app';
  }

  // 프로덕션 환경에서 /api 프록시 경로 사용 시 외부 URL로 대체
  if (!envUrl || envUrl === '/api') {
    // 브라우저에서 Railway 호스트인지 확인
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
  }

  return envUrl || '/api';
};

const API_BASE_URL = getApiBaseUrl(); // 환경 변수 또는 프록시 경로 사용

// API 요청을 위한 기본 fetch 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 토큰이 있다면 Authorization 헤더 추가
  const token = localStorage.getItem('access_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 회원 관리 API
export const memberAPI = {
  // 회원가입
  register: async (userData: {
    name: string;
    nickname: string;
    email: string;
    phone_number: string;
    birth_date: string;
    password: string;
    policy_agree_1: boolean;
    policy_agree_2: boolean;
  }) => {
    return apiRequest('/members/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 로그인
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{ access_token: string; refresh_token: string; user: any }>('/members/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // 회원 정보 조회
  getProfile: async () => {
    return apiRequest('/members/profile', {
      method: 'GET',
    });
  },

  // 토큰 새로고침
  refreshToken: async (refreshToken: string) => {
    return apiRequest<{ access_token: string }>('/members/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  // Pro 인증용 이메일 발송 (카카오 회원 등 기존 회원용)
  sendProVerification: async (email: string) => {
    return apiRequest<{ message: string }>('/members/send-pro-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Pro 인증 코드 확인
  verifyPro: async (email: string, code: number) => {
    return apiRequest<{ message: string; is_pro: boolean; verified_email: string }>('/members/verify-pro', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },
};

// 강의실 예약 API
export const classroomAPI = {
  // 강의실 목록 조회
  getClassrooms: async () => {
    return apiRequest('/classrooms/', {
      method: 'GET',
    });
  },

  // 강의실 예약
  createReservation: async (reservationData: {
    classroom_id: number;
    reserv_date: string;
    start_hour: number;
    end_hour: number;
    purpose?: string;
  }) => {
    return apiRequest('/classrooms/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  // 내 예약 목록 조회
  getMyReservations: async () => {
    return apiRequest('/classrooms/reservations/my', {
      method: 'GET',
    });
  },
};

// 챗봇 API
export const chatAPI = {
  // 채팅 히스토리 목록
  getChatHistories: async () => {
    return apiRequest('/chat/histories', {
      method: 'GET',
    });
  },

  // 새 채팅 시작
  createChatHistory: async (title: string) => {
    return apiRequest('/chat/histories', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  // 메시지 전송
  sendMessage: async (chatHistoryId: number, message: string) => {
    return apiRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({
        chat_history_id: chatHistoryId,
        message,
      }),
    });
  },
};

// 급식실 혼잡도 API
export const cafeteriaAPI = {
  // 현재 혼잡도 조회
  getCurrentCongestion: async () => {
    return apiRequest('/cafeteria/congestion/current', {
      method: 'GET',
    });
  },

  // 혼잡도 기록 조회
  getCongestionHistory: async (date?: string) => {
    const endpoint = date ? `/cafeteria/congestion/history?date=${date}` : '/cafeteria/congestion/history';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },
};

// 헬스체크 API
export const healthAPI = {
  checkHealth: async () => {
    return apiRequest('/', {
      method: 'GET',
    });
  },
};

// 운세 API (AI-RAG 서버)
// Railway 내부 URL(.railway.internal)은 브라우저에서 접근 불가하므로 외부 URL로 대체
const getFortuneApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_GEMINI_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    console.warn('Railway internal URL detected for AI-RAG, using public URL instead');
    return 'https://ai-rag-production.up.railway.app';
  }

  // 프로덕션 환경에서 /gemini-api 프록시 경로 사용 시 외부 URL로 대체
  if (!envUrl || envUrl === '/gemini-api') {
    // 브라우저에서 Railway 호스트인지 확인
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://ai-rag-production.up.railway.app';
    }
  }

  return envUrl || 'http://localhost:8001';
};

const FORTUNE_API_BASE_URL = getFortuneApiBaseUrl();

async function fortuneApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${FORTUNE_API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fortune API request failed:', error);
    throw error;
  }
}

export const fortuneAPI = {
  // 애정운 조회
  getLoveFortune: async (data: {
    name: string;
    birth_date: string;
    gender: string;
    birth_slot?: string;
  }) => {
    return fortuneApiRequest<{
      fortune_type: string;
      result: string;
      processing_time: number;
    }>('/fortune/love', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        birth_slot: data.birth_slot || '모름'
      }),
    });
  },

  // 성공운 조회
  getSuccessFortune: async (data: {
    name: string;
    birth_date: string;
    gender: string;
    birth_slot?: string;
  }) => {
    return fortuneApiRequest<{
      fortune_type: string;
      title: string;
      description: string;
      processing_time: number;
    }>('/fortune/success', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        birth_slot: data.birth_slot || '모름'
      }),
    });
  },

  // 재물운 조회
  getWealthFortune: async (data: {
    name: string;
    birth_date: string;
    gender: string;
    birth_slot?: string;
  }) => {
    return fortuneApiRequest<{
      fortune_type: string;
      result: string;
      processing_time: number;
    }>('/fortune/wealth', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        birth_slot: data.birth_slot || '모름'
      }),
    });
  },
};

// 관리자 API 타입
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  nickname: string;
  is_pro: boolean;
  is_admin: boolean;
  oauth_provider: string | null;
  created_at: string;
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  nickname: string;
  phone_number: string | null;
  birth_date: string | null;
  is_pro: boolean;
  is_admin: boolean;
  verified_email: string | null;
  oauth_provider: string | null;
  oauth_id: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PaginatedResponse {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PlatformStats {
  total_users: number;
  pro_users: number;
  admin_users: number;
  kakao_users: number;
  today_signups: number;
}

// 관리자 API
export const adminAPI = {
  // 회원 목록 조회
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    filter_pro?: boolean;
    filter_admin?: boolean;
  } = {}): Promise<PaginatedResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.filter_pro !== undefined) queryParams.append('filter_pro', params.filter_pro.toString());
    if (params.filter_admin !== undefined) queryParams.append('filter_admin', params.filter_admin.toString());

    const queryString = queryParams.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;

    return apiRequest<PaginatedResponse>(endpoint, {
      method: 'GET',
    });
  },

  // 회원 상세 정보 조회
  getUserDetail: async (userId: number): Promise<UserDetail> => {
    return apiRequest<UserDetail>(`/admin/users/${userId}`, {
      method: 'GET',
    });
  },

  // 회원 권한 수정
  updateUser: async (userId: number, data: {
    is_pro?: boolean;
    is_admin?: boolean;
  }): Promise<UserDetail> => {
    return apiRequest<UserDetail>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 회원 삭제
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // 플랫폼 통계 조회
  getStats: async (): Promise<PlatformStats> => {
    return apiRequest<PlatformStats>('/admin/stats', {
      method: 'GET',
    });
  },
};