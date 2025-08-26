// API 기본 설정 및 서비스
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API 요청을 위한 기본 fetch 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // 토큰이 있다면 Authorization 헤더 추가
  const token = localStorage.getItem('accessToken');
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