import { computed } from 'vue'

/**
 * 사용자 정보를 관리하는 composable
 * localStorage에서 사용자 프로필을 읽어 필요한 정보를 반환
 */
export function useUser() {
  const userName = computed(() => {
    try {
      const userProfile = localStorage.getItem('dev_user_profile')
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        return profile.nickname || profile.name || '이용자'
      }
    } catch {
      // JSON 파싱 실패 시 무시
    }
    return '이용자'
  })

  return {
    userName
  }
}
