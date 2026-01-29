<template>
  <div class="chat-log-viewer">
    <h2 class="section-title">채팅 로그 뷰어</h2>

    <div class="viewer-layout">
      <!-- 채팅 세션 목록 -->
      <div class="sessions-panel">
        <div class="panel-header">
          <h3>채팅 세션</h3>
          <span class="session-count">{{ sessions.length }}개</span>
        </div>

        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="세션 검색..."
            @input="debouncedSearch"
          />
        </div>

        <div v-if="loadingSessions" class="loading-state">
          <div class="spinner"></div>
        </div>

        <div v-else class="sessions-list">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="session-card"
            :class="{ active: selectedSession?.id === session.id }"
            @click="selectSession(session)"
          >
            <div class="session-info">
              <span class="session-title">{{ session.title || '제목 없음' }}</span>
              <span class="session-meta">
                <span class="user-badge">{{ getUserName(session.user_id) }}</span>
                <span class="message-count">{{ getMessageCount(session.id) }}개 메시지</span>
              </span>
            </div>
            <span class="session-date">{{ formatDate(session.created_at) }}</span>
          </div>

          <div v-if="sessions.length === 0" class="empty-state">
            채팅 세션이 없습니다
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="pagination">
          <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
        </div>
      </div>

      <!-- 채팅 내용 -->
      <div class="chat-panel">
        <div v-if="selectedSession" class="chat-content">
          <div class="chat-header">
            <div class="chat-info">
              <h3>{{ selectedSession.title || '제목 없음' }}</h3>
              <span class="chat-meta">
                사용자: {{ getUserName(selectedSession.user_id) }} |
                생성: {{ formatDateFull(selectedSession.created_at) }}
              </span>
            </div>
            <div class="chat-actions">
              <button class="action-btn" @click="exportChat" title="내보내기">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="action-btn delete" @click="confirmDeleteSession" title="세션 삭제">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="loadingMessages" class="loading-state">
            <div class="spinner"></div>
            <span>메시지 로딩 중...</span>
          </div>

          <div v-else class="messages-container">
            <div
              v-for="(message, idx) in messages"
              :key="idx"
              class="message-bubble"
              :class="{ 'user-message': message.is_user, 'ai-message': !message.is_user }"
            >
              <div class="message-header">
                <span class="sender">
                  {{ message.is_user ? '사용자' : 'AI' }}
                  <span v-if="!message.is_user && message.model_name" class="model-badge">
                    {{ getModelDisplayName(message.model_name) }}
                  </span>
                </span>
              </div>
              <div class="message-body" v-html="formatMessage(message.message)"></div>
            </div>

            <div v-if="messages.length === 0" class="empty-messages">
              이 세션에 메시지가 없습니다
            </div>
          </div>
        </div>

        <div v-else class="select-prompt">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>왼쪽에서 채팅 세션을 선택하세요</p>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>세션 삭제</h3>
        <p>이 채팅 세션과 모든 메시지를 삭제하시겠습니까?</p>
        <p class="delete-warning">이 작업은 되돌릴 수 없습니다.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">취소</button>
          <button class="confirm-delete-btn" @click="deleteSession">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminAPI } from '../../services/api'
import { marked } from 'marked'

interface ChatSession {
  id: number
  user_id: number
  title: string
  created_at: string
}

interface ChatMessage {
  id: number
  chat_history_id: number
  is_user: boolean
  message: string
  model_name?: string
}

interface UserInfo {
  id: number
  name: string
  nickname: string
}

const sessions = ref<ChatSession[]>([])
const messages = ref<ChatMessage[]>([])
const users = ref<Map<number, UserInfo>>(new Map())
const messageCounts = ref<Map<number, number>>(new Map())
const selectedSession = ref<ChatSession | null>(null)
const loadingSessions = ref(false)
const loadingMessages = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const showDeleteModal = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const loadSessions = async () => {
  loadingSessions.value = true
  try {
    // 채팅 세션 목록 가져오기
    const response = await adminAPI.getTableData('chathistory', {
      page: currentPage.value,
      limit: 20,
      search: searchQuery.value || undefined,
    })

    sessions.value = response.rows as unknown as ChatSession[]
    totalPages.value = response.total_pages

    // 메시지 개수 계산을 위해 전체 메시지 가져오기
    await loadMessageCounts()
  } catch (error) {
    console.error('채팅 세션 로드 실패:', error)
  } finally {
    loadingSessions.value = false
  }
}

const loadMessageCounts = async () => {
  try {
    // 메시지 테이블에서 세션별 개수 계산 (백엔드 limit 최대값: 100)
    const response = await adminAPI.getTableData('chatmessage', {
      page: 1,
      limit: 100,
    })

    const counts = new Map<number, number>()
    for (const msg of response.rows as unknown as ChatMessage[]) {
      const count = counts.get(msg.chat_history_id) || 0
      counts.set(msg.chat_history_id, count + 1)
    }
    messageCounts.value = counts
  } catch (error) {
    console.error('메시지 개수 로드 실패:', error)
  }
}

const loadUsers = async () => {
  try {
    const response = await adminAPI.getTableData('member', {
      page: 1,
      limit: 100,
    })

    const userMap = new Map<number, UserInfo>()
    for (const user of response.rows as unknown as UserInfo[]) {
      userMap.set(user.id, user)
    }
    users.value = userMap
  } catch (error) {
    console.error('사용자 목록 로드 실패:', error)
  }
}

const selectSession = async (session: ChatSession) => {
  selectedSession.value = session
  loadingMessages.value = true

  try {
    // 해당 세션의 메시지만 필터링하여 가져오기 (백엔드 limit 최대값: 100)
    const response = await adminAPI.getTableData('chatmessage', {
      page: 1,
      limit: 100,
      filter_column: 'chat_history_id',
      filter_value: String(session.id),
    })

    // ID 순으로 정렬 (오래된 메시지가 먼저)
    messages.value = (response.rows as unknown as ChatMessage[])
      .sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error('메시지 로드 실패:', error)
  } finally {
    loadingMessages.value = false
  }
}

const getUserName = (userId: number): string => {
  const user = users.value.get(userId)
  return user?.nickname || user?.name || `사용자 #${userId}`
}

const getMessageCount = (sessionId: number): number => {
  return messageCounts.value.get(sessionId) || 0
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    // Invalid Date 체크
    if (isNaN(date.getTime())) return '-'

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDay === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDay < 7) {
      return `${diffDay}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    }
  } catch {
    return '-'
  }
}

const formatDateFull = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    // Invalid Date 체크
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleString('ko-KR')
  } catch {
    return '-'
  }
}

const getModelDisplayName = (modelName: string | null | undefined): string => {
  if (!modelName) return ''

  const displayNames: Record<string, string> = {
    '통합 모델': '💬 일반',
    '깊은 추론 모델': '🧠 CoT',
    '대학 정보 검색 모델': '🔍 RAG'
  }

  return displayNames[modelName] || modelName
}

const formatMessage = (message: string): string => {
  try {
    // marked를 사용하여 마크다운 변환
    return marked.parse(message) as string
  } catch {
    return message
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadSessions()
  }, 300)
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadSessions()
}

const exportChat = () => {
  if (!selectedSession.value || messages.value.length === 0) return

  let content = `채팅 세션: ${selectedSession.value.title}\n`
  content += `사용자: ${getUserName(selectedSession.value.user_id)}\n`
  content += `생성일: ${formatDateFull(selectedSession.value.created_at)}\n`
  content += `${'='.repeat(50)}\n\n`

  for (const msg of messages.value) {
    const sender = msg.is_user ? '[사용자]' : '[AI]'
    content += `${sender}\n${msg.message}\n\n`
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chat_${selectedSession.value.id}_${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const confirmDeleteSession = () => {
  showDeleteModal.value = true
}

const deleteSession = async () => {
  if (!selectedSession.value) return

  try {
    // 세션의 모든 메시지 삭제
    for (const msg of messages.value) {
      await adminAPI.deleteTableRow('chatmessage', msg.id)
    }

    // 세션 삭제
    await adminAPI.deleteTableRow('chathistory', selectedSession.value.id)

    showDeleteModal.value = false
    selectedSession.value = null
    messages.value = []

    // 목록 새로고침
    await loadSessions()
  } catch (error) {
    console.error('세션 삭제 실패:', error)
    alert('세션 삭제에 실패했습니다.')
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadSessions()])
})
</script>

<style scoped>
.chat-log-viewer {
  max-width: 1400px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

.viewer-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 500px;
}

/* 세션 패널 */
.sessions-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.session-count {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.search-box svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
}

.session-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.session-card:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.session-card.active {
  background: #eff6ff;
  border-color: #02478A;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.session-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.session-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.user-badge {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
}

.session-date {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

/* 채팅 패널 */
.chat-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.chat-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.chat-meta {
  font-size: 13px;
  color: #6b7280;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  max-width: 85%;
  padding: 14px 18px;
  border-radius: 16px;
}

.user-message {
  align-self: flex-end;
  background: #02478A;
  color: #fff;
}

.ai-message {
  align-self: flex-start;
  background: #f3f4f6;
  color: #1f2937;
}

.model-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  opacity: 0.9;
}

.user-message .model-badge {
  background: rgba(255, 255, 255, 0.3);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sender {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.user-message .sender {
  color: rgba(255, 255, 255, 0.8);
}

.message-body {
  font-size: 14px;
  line-height: 1.6;
}

.message-body :deep(p) {
  margin: 0 0 8px 0;
}

.message-body :deep(p:last-child) {
  margin-bottom: 0;
}

.message-body :deep(ul),
.message-body :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-body :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 13px;
}

.user-message .message-body :deep(code) {
  background: rgba(255, 255, 255, 0.2);
}

.message-body :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.empty-messages {
  text-align: center;
  color: #9ca3af;
  padding: 48px;
}

/* 선택 안내 */
.select-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #9ca3af;
}

.select-prompt p {
  font-size: 16px;
}

/* 로딩 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #02478A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid #e5e7eb;
}

.pagination button {
  padding: 6px 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 13px;
  color: #6b7280;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 32px;
  font-size: 14px;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 8px;
}

.delete-warning {
  color: #ef4444 !important;
  font-size: 13px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.confirm-delete-btn {
  padding: 10px 20px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

/* 반응형 */
@media (max-width: 900px) {
  .viewer-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .sessions-panel {
    max-height: 300px;
  }

  .chat-panel {
    min-height: 400px;
  }
}
</style>
