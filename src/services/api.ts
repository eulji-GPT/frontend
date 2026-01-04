// API 기본 설정 및 서비스
import { getApiBaseUrl } from '../utils/ports-config';

const API_BASE_URL = getApiBaseUrl();

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

  // 회원 탈퇴
  deleteAccount: async () => {
    return apiRequest<{ status: string; message: string }>('/member/me', {
      method: 'DELETE',
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

  // 개별 채팅 히스토리 삭제
  deleteChat: async (chatId: string | number) => {
    return apiRequest(`/chat/histories/${chatId}`, {
      method: 'DELETE',
    });
  },

  // 모든 채팅 히스토리 삭제 (루프 방식)
  deleteAllChats: async () => {
    try {
      const histories = await chatAPI.getChatHistories() as any[];
      const errors: string[] = [];

      for (const history of histories) {
        try {
          await chatAPI.deleteChat(history.id);
        } catch (error) {
          console.error(`Failed to delete chat ${history.id}:`, error);
          errors.push(`채팅 ${history.id} 삭제 실패`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`일부 채팅 삭제 실패: ${errors.join(', ')}`);
      }

      return { message: '모든 채팅이 삭제되었습니다' };
    } catch (error) {
      console.error('Failed to delete all chats:', error);
      throw error;
    }
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

// DB 브라우저 관련 타입
export interface TableInfo {
  name: string;
  display_name: string;
  row_count: number;
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  primary_key: boolean;
}

export interface TableDataResponse {
  table_name: string;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TablesListResponse {
  tables: TableInfo[];
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

  // DB 브라우저 - 테이블 목록 조회
  getTables: async (): Promise<TablesListResponse> => {
    return apiRequest<TablesListResponse>('/admin/db/tables', {
      method: 'GET',
    });
  },

  // DB 브라우저 - 테이블 데이터 조회
  getTableData: async (tableName: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    filter_column?: string;
    filter_value?: string;
  } = {}): Promise<TableDataResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.filter_column) queryParams.append('filter_column', params.filter_column);
    if (params.filter_value) queryParams.append('filter_value', params.filter_value);

    const queryString = queryParams.toString();
    const endpoint = `/admin/db/tables/${tableName}${queryString ? `?${queryString}` : ''}`;

    return apiRequest<TableDataResponse>(endpoint, {
      method: 'GET',
    });
  },

  // DB 브라우저 - 레코드 삭제
  deleteTableRow: async (tableName: string, rowId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/db/tables/${tableName}/${rowId}`, {
      method: 'DELETE',
    });
  },
};