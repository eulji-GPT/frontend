<template>
  <div class="content-manager">
    <h2 class="section-title">콘텐츠 관리</h2>

    <!-- 탭 네비게이션 -->
    <div class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'news' }"
        @click="activeTab = 'news'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
        </svg>
        공지사항
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'faq' }"
        @click="activeTab = 'faq'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        자주 묻는 질문
      </button>
    </div>

    <!-- 공지사항 관리 -->
    <div v-if="activeTab === 'news'" class="content-section">
      <div class="section-header">
        <h3>공지사항 관리</h3>
        <button class="add-btn" @click="openNewsModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 공지 추가
        </button>
      </div>

      <div v-if="loadingNews" class="loading-state">
        <div class="spinner"></div>
        <span>로딩 중...</span>
      </div>

      <div v-else class="content-list">
        <div v-for="(item, index) in newsList" :key="index" class="content-card">
          <div class="card-content">
            <h4>{{ item.title }}</h4>
            <p class="card-desc">{{ item.desc || '설명 없음' }}</p>
            <span class="card-date">{{ item.date }}</span>
          </div>
          <div class="card-actions">
            <button class="edit-btn" @click="openNewsModal(item)" title="수정">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="delete-btn" @click="confirmDeleteNews(item.row_number)" title="삭제">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="newsList.length === 0" class="empty-state">
          공지사항이 없습니다
        </div>
      </div>
    </div>

    <!-- FAQ 관리 -->
    <div v-if="activeTab === 'faq'" class="content-section">
      <div class="section-header">
        <h3>자주 묻는 질문 관리</h3>
        <button class="add-btn" @click="openFaqModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 FAQ 추가
        </button>
      </div>

      <div v-if="loadingFaq" class="loading-state">
        <div class="spinner"></div>
        <span>로딩 중...</span>
      </div>

      <div v-else class="content-list">
        <div v-for="(item, index) in faqList" :key="index" class="content-card faq-card">
          <div class="card-content">
            <div class="faq-question">
              <span class="q-badge">Q</span>
              <h4>{{ item.q }}</h4>
            </div>
            <div class="faq-answer">
              <span class="a-badge">A</span>
              <p>{{ item.a }}</p>
            </div>
          </div>
          <div class="card-actions">
            <button class="edit-btn" @click="openFaqModal(item)" title="수정">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="delete-btn" @click="confirmDeleteFaq(item.row_number)" title="삭제">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="faqList.length === 0" class="empty-state">
          FAQ가 없습니다
        </div>
      </div>
    </div>

    <!-- 공지사항 모달 -->
    <div v-if="showNewsModal" class="modal-overlay" @click.self="showNewsModal = false">
      <div class="modal-content">
        <h3>{{ editingNewsRowNumber !== null ? '공지사항 수정' : '새 공지사항 추가' }}</h3>
        <div class="form-group">
          <label>제목 *</label>
          <input v-model="newsForm.title" type="text" placeholder="공지 제목" />
        </div>
        <div class="form-group">
          <label>날짜</label>
          <input v-model="newsForm.date" type="date" />
        </div>
        <div class="form-group">
          <label>설명</label>
          <textarea v-model="newsForm.desc" placeholder="공지 내용" rows="4"></textarea>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showNewsModal = false">취소</button>
          <button class="submit-btn" @click="saveNews" :disabled="!newsForm.title">저장</button>
        </div>
      </div>
    </div>

    <!-- FAQ 모달 -->
    <div v-if="showFaqModal" class="modal-overlay" @click.self="showFaqModal = false">
      <div class="modal-content">
        <h3>{{ editingFaqRowNumber !== null ? 'FAQ 수정' : '새 FAQ 추가' }}</h3>
        <div class="form-group">
          <label>질문 *</label>
          <input v-model="faqForm.q" type="text" placeholder="자주 묻는 질문" />
        </div>
        <div class="form-group">
          <label>답변 *</label>
          <textarea v-model="faqForm.a" placeholder="답변 내용" rows="4"></textarea>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showFaqModal = false">취소</button>
          <button class="submit-btn" @click="saveFaq" :disabled="!faqForm.q || !faqForm.a">저장</button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content delete-modal">
        <h3>삭제 확인</h3>
        <p>{{ deleteType === 'news' ? '이 공지사항을' : '이 FAQ를' }} 삭제하시겠습니까?</p>
        <p class="delete-warning">이 작업은 되돌릴 수 없습니다.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">취소</button>
          <button class="delete-confirm-btn" @click="executeDelete">삭제</button>
        </div>
      </div>
    </div>

    <!-- 토스트 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getApiBaseUrl } from '../../utils/ports-config'

const API_BASE_URL = getApiBaseUrl()

interface NewsItem {
  title: string
  date: string
  desc: string
  row_number: number
}

interface FaqItem {
  q: string
  a: string
  row_number: number
}

const activeTab = ref<'news' | 'faq'>('news')

// News state
const newsList = ref<NewsItem[]>([])
const loadingNews = ref(false)
const showNewsModal = ref(false)
const editingNewsRowNumber = ref<number | null>(null)
const newsForm = reactive({
  title: '',
  date: '',
  desc: ''
})

// FAQ state
const faqList = ref<FaqItem[]>([])
const loadingFaq = ref(false)
const showFaqModal = ref(false)
const editingFaqRowNumber = ref<number | null>(null)
const faqForm = reactive({
  q: '',
  a: ''
})

// Delete state
const showDeleteModal = ref(false)
const deleteType = ref<'news' | 'faq'>('news')
const deleteRowNumber = ref<number | null>(null)

// Toast
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// Load news
const loadNews = async () => {
  loadingNews.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/news/admin`, {
      headers: getAuthHeaders()
    })
    if (response.ok) {
      newsList.value = await response.json()
    }
  } catch (error) {
    console.error('공지사항 로드 실패:', error)
  } finally {
    loadingNews.value = false
  }
}

// Load FAQ
const loadFaq = async () => {
  loadingFaq.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/faq/admin`, {
      headers: getAuthHeaders()
    })
    if (response.ok) {
      faqList.value = await response.json()
    }
  } catch (error) {
    console.error('FAQ 로드 실패:', error)
  } finally {
    loadingFaq.value = false
  }
}

// News modal
const openNewsModal = (item?: NewsItem) => {
  if (item) {
    newsForm.title = item.title
    newsForm.date = item.date
    newsForm.desc = item.desc
    editingNewsRowNumber.value = item.row_number
  } else {
    newsForm.title = ''
    newsForm.date = new Date().toISOString().slice(0, 10)
    newsForm.desc = ''
    editingNewsRowNumber.value = null
  }
  showNewsModal.value = true
}

// Save news
const saveNews = async () => {
  try {
    const rowNumber = editingNewsRowNumber.value
    const method = rowNumber ? 'PUT' : 'POST'
    const url = rowNumber ? `${API_BASE_URL}/news/${rowNumber}` : `${API_BASE_URL}/news`

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: newsForm.title,
        date: newsForm.date,
        desc: newsForm.desc
      })
    })

    if (response.ok) {
      showToast(editingNewsRowNumber.value !== null ? '공지사항이 수정되었습니다' : '공지사항이 추가되었습니다', 'success')
      showNewsModal.value = false
      await loadNews()
    } else {
      const error = await response.json()
      showToast(error.detail || '저장에 실패했습니다', 'error')
    }
  } catch (error) {
    console.error('공지사항 저장 실패:', error)
    showToast('저장에 실패했습니다', 'error')
  }
}

// FAQ modal
const openFaqModal = (item?: FaqItem) => {
  if (item) {
    faqForm.q = item.q
    faqForm.a = item.a
    editingFaqRowNumber.value = item.row_number
  } else {
    faqForm.q = ''
    faqForm.a = ''
    editingFaqRowNumber.value = null
  }
  showFaqModal.value = true
}

// Save FAQ
const saveFaq = async () => {
  try {
    const rowNumber = editingFaqRowNumber.value
    const method = rowNumber ? 'PUT' : 'POST'
    const url = rowNumber ? `${API_BASE_URL}/faq/${rowNumber}` : `${API_BASE_URL}/faq`

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        q: faqForm.q,
        a: faqForm.a
      })
    })

    if (response.ok) {
      showToast(editingFaqRowNumber.value !== null ? 'FAQ가 수정되었습니다' : 'FAQ가 추가되었습니다', 'success')
      showFaqModal.value = false
      await loadFaq()
    } else {
      const error = await response.json()
      showToast(error.detail || '저장에 실패했습니다', 'error')
    }
  } catch (error) {
    console.error('FAQ 저장 실패:', error)
    showToast('저장에 실패했습니다', 'error')
  }
}

// Delete confirmation
const confirmDeleteNews = (rowNumber: number) => {
  deleteType.value = 'news'
  deleteRowNumber.value = rowNumber
  showDeleteModal.value = true
}

const confirmDeleteFaq = (rowNumber: number) => {
  deleteType.value = 'faq'
  deleteRowNumber.value = rowNumber
  showDeleteModal.value = true
}

// Execute delete
const executeDelete = async () => {
  if (deleteRowNumber.value === null) return

  try {
    const url = deleteType.value === 'news' ? `${API_BASE_URL}/news/${deleteRowNumber.value}` : `${API_BASE_URL}/faq/${deleteRowNumber.value}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (response.ok) {
      showToast(deleteType.value === 'news' ? '공지사항이 삭제되었습니다' : 'FAQ가 삭제되었습니다', 'success')
      showDeleteModal.value = false
      if (deleteType.value === 'news') {
        await loadNews()
      } else {
        await loadFaq()
      }
    } else {
      showToast('삭제에 실패했습니다', 'error')
    }
  } catch (error) {
    console.error('삭제 실패:', error)
    showToast('삭제에 실패했습니다', 'error')
  }
}

// Toast
const showToast = (message: string, type: 'success' | 'error') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

onMounted(() => {
  loadNews()
  loadFaq()
})
</script>

<style scoped>
.content-manager {
  max-width: 1200px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

/* 탭 네비게이션 */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-btn.active {
  background: #eff6ff;
  color: #02478A;
}

/* 섹션 헤더 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #02478A;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #023a6e;
}

/* 콘텐츠 리스트 */
.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.content-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.card-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.card-date {
  font-size: 12px;
  color: #9ca3af;
}

/* FAQ 카드 */
.faq-card .card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-question,
.faq-answer {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.q-badge,
.a-badge {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}

.q-badge {
  background: #02478A;
  color: #fff;
}

.a-badge {
  background: #e5e7eb;
  color: #374151;
}

.faq-question h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.faq-answer p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 카드 액션 */
.card-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* 로딩 & 빈 상태 */
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

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 48px;
  background: #f9fafb;
  border-radius: 10px;
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
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #02478A;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
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

.submit-btn {
  padding: 10px 20px;
  background: #02478A;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-modal p {
  color: #6b7280;
  margin-bottom: 8px;
}

.delete-warning {
  color: #ef4444 !important;
  font-size: 13px;
}

.delete-confirm-btn {
  padding: 10px 20px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

/* 토스트 */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  animation: slideIn 0.3s ease;
  z-index: 1100;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 반응형 */
@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .content-card {
    flex-direction: column;
    gap: 12px;
  }

  .card-actions {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>
