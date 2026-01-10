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

// 리프레시 토큰 관련 함수
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token)
}

export const removeRefreshToken = (): void => {
  localStorage.removeItem('refreshToken')
}

// 토큰 갱신 함수
export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch('/api/members/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      setAccessToken(data.access_token)
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token)
      }
      return true
    }

    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

// 토큰 만료 등으로 인한 로그아웃
export const logout = (): void => {
  removeAccessToken()
  removeRefreshToken()
  removeUserInfo()
  window.location.href = '/login'
}

// API 요청 래퍼 (자동 인증 헤더 포함 + 자동 토큰 갱신)
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // 쿠키 포함
  })

  // 401 Unauthorized 시 토큰 갱신 시도
  if (response.status === 401) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      // 토큰 갱신 성공 시 원래 요청 재시도
      const newHeaders = {
        ...getAuthHeaders(),
        ...options.headers
      }

      response = await fetch(url, {
        ...options,
        headers: newHeaders,
        credentials: 'include'
      })
    } else {
      // 토큰 갱신 실패 시 로그아웃
      logout()
      throw new Error('Authentication expired. Please log in again.')
    }
  }

  return response
}
