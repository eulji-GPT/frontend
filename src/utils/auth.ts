// 인증 관련 유틸리티 함수들

export interface UserInfo {
  id: number
  name: string
  email: string
  nickname: string
  is_pro: boolean
  is_admin: boolean
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

export const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token)
}

export const removeAccessToken = (): void => {
  localStorage.removeItem('accessToken')
}

export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

// 사용자 정보 저장/조회
export const getUserInfo = (): UserInfo | null => {
  const data = localStorage.getItem('user_info')
  return data ? JSON.parse(data) : null
}

export const setUserInfo = (user: UserInfo): void => {
  localStorage.setItem('user_info', JSON.stringify(user))
}

export const removeUserInfo = (): void => {
  localStorage.removeItem('user_info')
}

// 관리자 여부 체크
export const isAdmin = (): boolean => {
  const user = getUserInfo()
  return user?.is_admin === true
}

// API 요청 시 사용할 헤더
export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken()
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  }
}

// 토큰 만료 등으로 인한 로그아웃
export const logout = (): void => {
  removeAccessToken()
  removeUserInfo()
  // 필요하면 여기서 리프레시 토큰도 삭제 (쿠키)
  window.location.href = '/login'
}

// API 요청 래퍼 (자동 인증 헤더 포함)
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // 쿠키 포함
  })

  // 401 Unauthorized 시 로그아웃
  if (response.status === 401) {
    logout()
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
  }

  return response
}
