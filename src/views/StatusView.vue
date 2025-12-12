<template>
  <div class="status-container">
    <!-- 헤더 섹션 -->
    <div class="header-section">
      <h1 class="main-title">시스템 상태</h1>
      <div class="divider-section">
        <div class="divider-line"></div>
        <p class="subtitle">을GPT 서비스의 실시간 상태를 확인하세요</p>
      </div>
      <button class="refresh-button" @click="refreshAll" :disabled="isRefreshing">
        <span v-if="isRefreshing">새로고침 중...</span>
        <span v-else>새로고침</span>
      </button>
    </div>

    <!-- 전체 상태 요약 -->
    <div class="summary-section">
      <div class="summary-card" :class="overallStatusClass">
        <div class="summary-icon">{{ overallStatusIcon }}</div>
        <div class="summary-info">
          <h2 class="summary-title">전체 시스템 상태</h2>
          <p class="summary-status">{{ overallStatusText }}</p>
        </div>
      </div>
    </div>

    <!-- 서비스 상태 카드들 -->
    <div class="services-section">
      <h2 class="section-title">서비스 상태</h2>
      <div class="services-grid">
        <!-- Backend 서버 -->
        <div class="service-card" :class="getStatusClass(backendStatus)">
          <div class="service-header">
            <div class="service-icon">🖥️</div>
            <div class="service-name">Backend API</div>
            <div class="status-badge" :class="getStatusClass(backendStatus)">
              {{ getStatusText(backendStatus) }}
            </div>
          </div>
          <div class="service-details">
            <div class="detail-item">
              <span class="detail-label">URL</span>
              <span class="detail-value">{{ backendUrl }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">응답 시간</span>
              <span class="detail-value">{{ backendResponseTime }}ms</span>
            </div>
            <div class="detail-item" v-if="backendInfo">
              <span class="detail-label">버전</span>
              <span class="detail-value">{{ backendInfo.version || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- AI-RAG 서버 -->
        <div class="service-card" :class="getStatusClass(aiRagStatus)">
          <div class="service-header">
            <div class="service-icon">🤖</div>
            <div class="service-name">AI-RAG Service</div>
            <div class="status-badge" :class="getStatusClass(aiRagStatus)">
              {{ getStatusText(aiRagStatus) }}
            </div>
          </div>
          <div class="service-details">
            <div class="detail-item">
              <span class="detail-label">URL</span>
              <span class="detail-value">{{ aiRagUrl }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">응답 시간</span>
              <span class="detail-value">{{ aiRagResponseTime }}ms</span>
            </div>
            <div class="detail-item" v-if="aiRagInfo">
              <span class="detail-label">모델</span>
              <span class="detail-value">{{ aiRagInfo.model || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- RAG 시스템 -->
        <div class="service-card" :class="getStatusClass(ragSystemStatus)">
          <div class="service-header">
            <div class="service-icon">📚</div>
            <div class="service-name">RAG System</div>
            <div class="status-badge" :class="getStatusClass(ragSystemStatus)">
              {{ getStatusText(ragSystemStatus) }}
            </div>
          </div>
          <div class="service-details">
            <div class="detail-item">
              <span class="detail-label">초기화</span>
              <span class="detail-value">{{ ragSystemInfo?.initialized ? '완료' : '미완료' }}</span>
            </div>
            <div class="detail-item" v-if="ragSystemInfo?.embedding_model">
              <span class="detail-label">임베딩 모델</span>
              <span class="detail-value">{{ ragSystemInfo.embedding_model }}</span>
            </div>
            <div class="detail-item" v-if="ragSystemInfo?.document_count">
              <span class="detail-label">문서 수</span>
              <span class="detail-value">{{ ragSystemInfo.document_count?.toLocaleString() }}개</span>
            </div>
            <div class="detail-item" v-if="ragSystemInfo?.embedding_dimension">
              <span class="detail-label">임베딩 차원</span>
              <span class="detail-value">{{ ragSystemInfo.embedding_dimension }}</span>
            </div>
            <div class="detail-item" v-if="ragSystemInfo?.llm_model">
              <span class="detail-label">LLM 모델</span>
              <span class="detail-value">{{ ragSystemInfo.llm_model }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 시스템 정보 -->
    <div class="system-info-section">
      <h2 class="section-title">시스템 정보</h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">🌐</div>
          <div class="info-content">
            <div class="info-label">프론트엔드</div>
            <div class="info-value">Vue 3 + TypeScript</div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">⚡</div>
          <div class="info-content">
            <div class="info-label">백엔드</div>
            <div class="info-value">FastAPI + Python</div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">🧠</div>
          <div class="info-content">
            <div class="info-label">AI 모델</div>
            <div class="info-value">Gemini 2.5 Flash</div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">🔍</div>
          <div class="info-content">
            <div class="info-label">벡터 검색</div>
            <div class="info-value">FAISS + Gemini Embedding</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 마지막 업데이트 시간 -->
    <div class="update-info">
      <span>마지막 업데이트: {{ lastUpdated }}</span>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <button class="secondary-button" @click="goBack">
        <span class="button-text">돌아가기</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 상태 타입 정의
type ServiceStatus = 'online' | 'offline' | 'loading' | 'error';

// 상태 변수들
const isRefreshing = ref(false);
const lastUpdated = ref('');

// Backend 상태
const backendStatus = ref<ServiceStatus>('loading');
const backendResponseTime = ref(0);
const backendInfo = ref<any>(null);

// AI-RAG 상태
const aiRagStatus = ref<ServiceStatus>('loading');
const aiRagResponseTime = ref(0);
const aiRagInfo = ref<any>(null);

// RAG 시스템 상태
const ragSystemStatus = ref<ServiceStatus>('loading');
const ragSystemInfo = ref<any>(null);

// URL 설정
const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;
  if (envUrl && envUrl.includes('.railway.internal')) {
    return 'https://fastapi-backend-production-2cd0.up.railway.app';
  }
  if (!envUrl || envUrl === '/api') {
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'euljigpt.com') {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
  }
  return envUrl || '/api';
};

const getAiRagUrl = () => {
  const envUrl = import.meta.env.VITE_GEMINI_FASTAPI_URL;
  if (envUrl && envUrl.includes('.railway.internal')) {
    return 'https://ai-rag-production.up.railway.app';
  }
  if (!envUrl || envUrl === '/gemini-api') {
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://ai-rag-production.up.railway.app';
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'euljigpt.com') {
      return 'https://ai-rag-production.up.railway.app';
    }
  }
  return envUrl || 'http://localhost:8001';
};

const backendUrl = computed(() => getBackendUrl());
const aiRagUrl = computed(() => getAiRagUrl());

// 전체 상태 계산
const overallStatusClass = computed(() => {
  if (backendStatus.value === 'online' && aiRagStatus.value === 'online' && ragSystemStatus.value === 'online') {
    return 'healthy';
  }
  if (backendStatus.value === 'loading' || aiRagStatus.value === 'loading' || ragSystemStatus.value === 'loading') {
    return 'loading';
  }
  if (backendStatus.value === 'offline' || aiRagStatus.value === 'offline') {
    return 'unhealthy';
  }
  return 'warning';
});

const overallStatusIcon = computed(() => {
  switch (overallStatusClass.value) {
    case 'healthy': return '✅';
    case 'warning': return '⚠️';
    case 'unhealthy': return '❌';
    default: return '🔄';
  }
});

const overallStatusText = computed(() => {
  switch (overallStatusClass.value) {
    case 'healthy': return '모든 서비스가 정상 작동 중입니다';
    case 'warning': return '일부 서비스에 문제가 있습니다';
    case 'unhealthy': return '서비스에 장애가 발생했습니다';
    default: return '상태 확인 중...';
  }
});

// 상태 클래스 헬퍼
const getStatusClass = (status: ServiceStatus) => {
  switch (status) {
    case 'online': return 'online';
    case 'offline': return 'offline';
    case 'error': return 'error';
    default: return 'loading';
  }
};

const getStatusText = (status: ServiceStatus) => {
  switch (status) {
    case 'online': return '정상';
    case 'offline': return '오프라인';
    case 'error': return '오류';
    default: return '확인 중';
  }
};

// Backend 상태 체크
const checkBackendStatus = async () => {
  backendStatus.value = 'loading';
  const startTime = performance.now();

  try {
    const response = await fetch(`${getBackendUrl()}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    backendResponseTime.value = Math.round(performance.now() - startTime);

    if (response.ok) {
      backendInfo.value = await response.json();
      backendStatus.value = 'online';
    } else {
      backendStatus.value = 'error';
    }
  } catch (error) {
    backendResponseTime.value = Math.round(performance.now() - startTime);
    backendStatus.value = 'offline';
    console.error('Backend status check failed:', error);
  }
};

// AI-RAG 상태 체크
const checkAiRagStatus = async () => {
  aiRagStatus.value = 'loading';
  const startTime = performance.now();

  try {
    const response = await fetch(`${getAiRagUrl()}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    aiRagResponseTime.value = Math.round(performance.now() - startTime);

    if (response.ok) {
      aiRagInfo.value = await response.json();
      aiRagStatus.value = 'online';
    } else {
      aiRagStatus.value = 'error';
    }
  } catch (error) {
    aiRagResponseTime.value = Math.round(performance.now() - startTime);
    aiRagStatus.value = 'offline';
    console.error('AI-RAG status check failed:', error);
  }
};

// RAG 시스템 상태 체크
const checkRagSystemStatus = async () => {
  ragSystemStatus.value = 'loading';

  try {
    const response = await fetch(`${getAiRagUrl()}/rag/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      ragSystemInfo.value = await response.json();
      ragSystemStatus.value = ragSystemInfo.value?.initialized ? 'online' : 'error';
    } else {
      ragSystemStatus.value = 'error';
    }
  } catch (error) {
    ragSystemStatus.value = 'offline';
    console.error('RAG system status check failed:', error);
  }
};

// 전체 새로고침
const refreshAll = async () => {
  isRefreshing.value = true;

  await Promise.all([
    checkBackendStatus(),
    checkAiRagStatus(),
    checkRagSystemStatus()
  ]);

  lastUpdated.value = new Date().toLocaleString('ko-KR');
  isRefreshing.value = false;
};

// 돌아가기
const goBack = () => {
  router.go(-1);
};

// 초기 로드
onMounted(() => {
  refreshAll();
});
</script>

<style scoped>
/* 컨테이너 */
.status-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Pretendard, sans-serif;
  gap: 40px;
  background-color: #f9fafb;
}

/* 헤더 섹션 */
.header-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  max-width: 900px;
}

.main-title {
  color: rgb(31, 41, 55);
  font-size: 32px;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
}

.divider-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.divider-line {
  width: 200px;
  height: 1px;
  background-color: rgb(156, 163, 175);
}

.subtitle {
  color: rgb(107, 114, 128);
  font-size: 16px;
  margin: 0;
}

.refresh-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: rgb(2, 71, 138);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background-color: rgb(1, 56, 110);
}

.refresh-button:disabled {
  background-color: rgb(156, 163, 175);
  cursor: not-allowed;
}

/* 전체 상태 요약 */
.summary-section {
  width: 100%;
  max-width: 900px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.summary-card.healthy {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #10b981;
}

.summary-card.warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #f59e0b;
}

.summary-card.unhealthy {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border: 1px solid #ef4444;
}

.summary-card.loading {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #9ca3af;
}

.summary-icon {
  font-size: 48px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: rgb(31, 41, 55);
  margin: 0;
}

.summary-status {
  font-size: 16px;
  color: rgb(107, 114, 128);
  margin: 5px 0 0 0;
}

/* 서비스 섹션 */
.services-section {
  width: 100%;
  max-width: 900px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: rgb(31, 41, 55);
  margin: 0 0 20px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-card.online {
  border-left: 4px solid #10b981;
}

.service-card.offline {
  border-left: 4px solid #ef4444;
}

.service-card.error {
  border-left: 4px solid #f59e0b;
}

.service-card.loading {
  border-left: 4px solid #9ca3af;
}

.service-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.service-icon {
  font-size: 28px;
}

.service-name {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: rgb(31, 41, 55);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.online {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.offline {
  background-color: #fecaca;
  color: #991b1b;
}

.status-badge.error {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.loading {
  background-color: #e5e7eb;
  color: #4b5563;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: rgb(107, 114, 128);
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: rgb(31, 41, 55);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 시스템 정보 */
.system-info-section {
  width: 100%;
  max-width: 900px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.info-icon {
  font-size: 32px;
}

.info-label {
  font-size: 12px;
  color: rgb(107, 114, 128);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: rgb(31, 41, 55);
  margin-top: 4px;
}

/* 업데이트 정보 */
.update-info {
  color: rgb(156, 163, 175);
  font-size: 14px;
}

/* 하단 버튼 */
.bottom-actions {
  margin-top: 20px;
}

.secondary-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background-color: rgb(107, 114, 128);
  padding: 13px 24px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background-color: rgb(75, 85, 99);
  transform: translateY(-1px);
}

.button-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .status-container {
    padding: 20px;
    gap: 30px;
  }

  .main-title {
    font-size: 28px;
  }

  .summary-card {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .status-container {
    padding: 15px;
  }

  .main-title {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-value {
    max-width: 120px;
  }
}
</style>
