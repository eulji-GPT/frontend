<template>
  <div class="status-page">
    <!-- 헤더 섹션 -->
    <header class="status-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📊</span>
          시스템 상태
        </h1>
        <p class="page-subtitle">을GPT 서비스의 실시간 상태를 확인하세요</p>
        <button class="btn-primary" @click="refreshAll" :disabled="isRefreshing">
          <span v-if="isRefreshing" class="spinner"></span>
          <span>{{ isRefreshing ? '확인 중...' : '새로고침' }}</span>
        </button>
      </div>
    </header>

    <main class="status-content">
      <!-- 전체 상태 배너 -->
      <section class="status-banner" :class="overallStatusClass">
        <div class="banner-icon">{{ overallStatusIcon }}</div>
        <div class="banner-text">
          <h2 class="banner-title">{{ overallStatusTitle }}</h2>
          <p class="banner-description">{{ overallStatusText }}</p>
        </div>
        <div class="banner-indicator" :class="overallStatusClass"></div>
      </section>

      <!-- 서비스 카드 섹션 -->
      <section class="services-section">
        <h2 class="section-title">서비스 상태</h2>
        <div class="services-grid">
          <!-- Backend API -->
          <article class="service-card" :class="getStatusClass(backendStatus)">
            <div class="card-header">
              <div class="service-info">
                <span class="service-icon">🖥️</span>
                <h3 class="service-name">Backend API</h3>
              </div>
              <span class="status-pill" :class="getStatusClass(backendStatus)">
                {{ getStatusText(backendStatus) }}
              </span>
            </div>
            <div class="card-body">
              <div class="stat-row">
                <span class="stat-label">엔드포인트</span>
                <span class="stat-value truncate">{{ backendUrl }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">응답 시간</span>
                <span class="stat-value highlight">{{ backendResponseTime }}ms</span>
              </div>
              <div class="stat-row" v-if="backendInfo?.message">
                <span class="stat-label">상태</span>
                <span class="stat-value">{{ backendInfo.message }}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="status-dot" :class="getStatusClass(backendStatus)"></div>
              <span class="status-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>

          <!-- AI-RAG Service -->
          <article class="service-card" :class="getStatusClass(aiRagStatus)">
            <div class="card-header">
              <div class="service-info">
                <span class="service-icon">🤖</span>
                <h3 class="service-name">AI-RAG Service</h3>
              </div>
              <span class="status-pill" :class="getStatusClass(aiRagStatus)">
                {{ getStatusText(aiRagStatus) }}
              </span>
            </div>
            <div class="card-body">
              <div class="stat-row">
                <span class="stat-label">엔드포인트</span>
                <span class="stat-value truncate">{{ aiRagUrl }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">응답 시간</span>
                <span class="stat-value highlight">{{ aiRagResponseTime }}ms</span>
              </div>
              <div class="stat-row" v-if="aiRagInfo?.model">
                <span class="stat-label">AI 모델</span>
                <span class="stat-value">{{ aiRagInfo.model }}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="status-dot" :class="getStatusClass(aiRagStatus)"></div>
              <span class="status-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>

          <!-- RAG System -->
          <article class="service-card" :class="getStatusClass(ragSystemStatus)">
            <div class="card-header">
              <div class="service-info">
                <span class="service-icon">📚</span>
                <h3 class="service-name">RAG System</h3>
              </div>
              <span class="status-pill" :class="getStatusClass(ragSystemStatus)">
                {{ getStatusText(ragSystemStatus) }}
              </span>
            </div>
            <div class="card-body">
              <div class="stat-row">
                <span class="stat-label">초기화 상태</span>
                <span class="stat-value" :class="{ 'text-success': ragSystemInfo?.initialized }">
                  {{ ragSystemInfo?.initialized ? '완료' : '미완료' }}
                </span>
              </div>
              <div class="stat-row" v-if="ragSystemInfo?.embedding_model">
                <span class="stat-label">임베딩 모델</span>
                <span class="stat-value truncate">{{ ragSystemInfo.embedding_model }}</span>
              </div>
              <div class="stat-row" v-if="ragSystemInfo?.document_count">
                <span class="stat-label">인덱싱 문서</span>
                <span class="stat-value highlight">{{ ragSystemInfo.document_count?.toLocaleString() }}개</span>
              </div>
              <div class="stat-row" v-if="ragSystemInfo?.embedding_dimension">
                <span class="stat-label">벡터 차원</span>
                <span class="stat-value">{{ ragSystemInfo.embedding_dimension }}</span>
              </div>
              <div class="stat-row" v-if="ragSystemInfo?.llm_model">
                <span class="stat-label">LLM 모델</span>
                <span class="stat-value">{{ ragSystemInfo.llm_model }}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="status-dot" :class="getStatusClass(ragSystemStatus)"></div>
              <span class="status-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- 기술 스택 섹션 -->
      <section class="tech-section">
        <h2 class="section-title">기술 스택</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon-wrapper">
              <span class="tech-icon">🌐</span>
            </div>
            <div class="tech-info">
              <span class="tech-label">프론트엔드</span>
              <span class="tech-value">Vue 3 + TypeScript</span>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-wrapper">
              <span class="tech-icon">⚡</span>
            </div>
            <div class="tech-info">
              <span class="tech-label">백엔드</span>
              <span class="tech-value">FastAPI + Python</span>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-wrapper">
              <span class="tech-icon">🧠</span>
            </div>
            <div class="tech-info">
              <span class="tech-label">AI 모델</span>
              <span class="tech-value">Gemini 2.5 Flash</span>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-wrapper">
              <span class="tech-icon">🔍</span>
            </div>
            <div class="tech-info">
              <span class="tech-label">벡터 검색</span>
              <span class="tech-value">FAISS + Gemini Embedding</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 푸터 -->
      <footer class="status-footer">
        <p class="update-time" v-if="lastUpdated">마지막 업데이트: {{ lastUpdated }}</p>
        <button class="btn-secondary" @click="goBack">
          <span>← 돌아가기</span>
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 상태 타입
type ServiceStatus = 'online' | 'offline' | 'loading' | 'error';

// 상태 변수
const isRefreshing = ref(false);
const lastUpdated = ref('');

// Backend
const backendStatus = ref<ServiceStatus>('loading');
const backendResponseTime = ref(0);
const backendInfo = ref<any>(null);

// AI-RAG
const aiRagStatus = ref<ServiceStatus>('loading');
const aiRagResponseTime = ref(0);
const aiRagInfo = ref<any>(null);

// RAG System
const ragSystemStatus = ref<ServiceStatus>('loading');
const ragSystemInfo = ref<any>(null);

// URL 헬퍼
const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;
  if (envUrl?.includes('.railway.internal')) {
    return 'https://fastapi-backend-production-2cd0.up.railway.app';
  }
  if (!envUrl || envUrl === '/api') {
    if (typeof window !== 'undefined' &&
        (window.location.hostname.includes('railway.app') || window.location.hostname === 'euljigpt.com')) {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
  }
  return envUrl || '/api';
};

const getAiRagUrl = () => {
  const envUrl = import.meta.env.VITE_GEMINI_FASTAPI_URL;
  if (envUrl?.includes('.railway.internal')) {
    return 'https://ai-rag-production.up.railway.app';
  }
  if (!envUrl || envUrl === '/gemini-api') {
    if (typeof window !== 'undefined' &&
        (window.location.hostname.includes('railway.app') || window.location.hostname === 'euljigpt.com')) {
      return 'https://ai-rag-production.up.railway.app';
    }
  }
  return envUrl || 'http://localhost:8001';
};

const backendUrl = computed(() => getBackendUrl());
const aiRagUrl = computed(() => getAiRagUrl());

// 전체 상태
const overallStatusClass = computed(() => {
  const statuses = [backendStatus.value, aiRagStatus.value, ragSystemStatus.value];
  if (statuses.every(s => s === 'online')) return 'healthy';
  if (statuses.some(s => s === 'loading')) return 'loading';
  if (statuses.some(s => s === 'offline')) return 'critical';
  return 'warning';
});

const overallStatusIcon = computed(() => {
  const icons: Record<string, string> = {
    healthy: '✅',
    warning: '⚠️',
    critical: '❌',
    loading: '🔄'
  };
  return icons[overallStatusClass.value] || '🔄';
});

const overallStatusTitle = computed(() => {
  const titles: Record<string, string> = {
    healthy: '모든 시스템 정상',
    warning: '일부 서비스 주의',
    critical: '서비스 장애 발생',
    loading: '상태 확인 중'
  };
  return titles[overallStatusClass.value] || '상태 확인 중';
});

const overallStatusText = computed(() => {
  const texts: Record<string, string> = {
    healthy: '모든 서비스가 정상적으로 운영 중입니다.',
    warning: '일부 서비스에서 문제가 감지되었습니다.',
    critical: '서비스 접속에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
    loading: '서비스 상태를 확인하고 있습니다...'
  };
  return texts[overallStatusClass.value] || '상태를 확인하고 있습니다...';
});

// 상태 헬퍼
const getStatusClass = (status: ServiceStatus) => status;

const getStatusText = (status: ServiceStatus) => {
  const texts: Record<ServiceStatus, string> = {
    online: '정상',
    offline: '오프라인',
    error: '오류',
    loading: '확인 중'
  };
  return texts[status];
};

// API 체크
const checkBackendStatus = async () => {
  backendStatus.value = 'loading';
  const start = performance.now();
  try {
    const res = await fetch(`${getBackendUrl()}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    backendResponseTime.value = Math.round(performance.now() - start);
    if (res.ok) {
      backendInfo.value = await res.json();
      backendStatus.value = 'online';
    } else {
      backendStatus.value = 'error';
    }
  } catch {
    backendResponseTime.value = Math.round(performance.now() - start);
    backendStatus.value = 'offline';
  }
};

const checkAiRagStatus = async () => {
  aiRagStatus.value = 'loading';
  const start = performance.now();
  try {
    const res = await fetch(`${getAiRagUrl()}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    aiRagResponseTime.value = Math.round(performance.now() - start);
    if (res.ok) {
      aiRagInfo.value = await res.json();
      aiRagStatus.value = 'online';
    } else {
      aiRagStatus.value = 'error';
    }
  } catch {
    aiRagResponseTime.value = Math.round(performance.now() - start);
    aiRagStatus.value = 'offline';
  }
};

const checkRagSystemStatus = async () => {
  ragSystemStatus.value = 'loading';
  try {
    const res = await fetch(`${getAiRagUrl()}/rag/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      ragSystemInfo.value = await res.json();
      ragSystemStatus.value = ragSystemInfo.value?.initialized ? 'online' : 'error';
    } else {
      ragSystemStatus.value = 'error';
    }
  } catch {
    ragSystemStatus.value = 'offline';
  }
};

const refreshAll = async () => {
  isRefreshing.value = true;
  await Promise.all([checkBackendStatus(), checkAiRagStatus(), checkRagSystemStatus()]);
  lastUpdated.value = new Date().toLocaleString('ko-KR');
  isRefreshing.value = false;
};

const goBack = () => router.go(-1);

onMounted(() => refreshAll());
</script>

<style scoped>
/* ===== 기본 설정 ===== */
.status-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F3F8FF 0%, #FFFFFF 100%);
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ===== 헤더 ===== */
.status-header {
  background: linear-gradient(254deg, #17315F 5.17%, #02478A 45.43%, #0A6ECF 80.95%);
  padding: 56px 40px;
  color: white;
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.page-subtitle {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

/* ===== 버튼 ===== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 32px;
  background-color: #FFFFFF;
  color: #02478A;
  border: none;
  border-radius: 12px;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover:not(:disabled) {
  background-color: #F0F6FF;
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  background-color: #F3F4F6;
  color: #1F2937;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #E5E7EB;
  transform: translateY(-1px);
}

/* ===== 스피너 ===== */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #02478A;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 콘텐츠 ===== */
.status-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}

/* ===== 상태 배너 ===== */
.status-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
  border-radius: 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.status-banner.healthy {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1px solid #10B981;
}

.status-banner.warning {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1px solid #F59E0B;
}

.status-banner.critical {
  background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
  border: 1px solid #EF4444;
}

.status-banner.loading {
  background: linear-gradient(135deg, #F0F6FF 0%, #E5E7EB 100%);
  border: 1px solid #9CA3AF;
}

.banner-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 4px 0;
}

.banner-description {
  font-size: 16px;
  font-weight: 400;
  color: #6B7280;
  margin: 0;
}

.banner-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.banner-indicator.healthy { background-color: #10B981; }
.banner-indicator.warning { background-color: #F59E0B; }
.banner-indicator.critical { background-color: #EF4444; }
.banner-indicator.loading {
  background-color: #9CA3AF;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ===== 섹션 ===== */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 24px 0;
  line-height: 140%;
}

/* ===== 서비스 카드 ===== */
.services-section {
  margin-bottom: 40px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.service-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #F3F4F6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.service-card.online { border-top: 4px solid #10B981; }
.service-card.offline { border-top: 4px solid #EF4444; }
.service-card.error { border-top: 4px solid #F59E0B; }
.service-card.loading { border-top: 4px solid #9CA3AF; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.service-icon {
  font-size: 28px;
}

.service-name {
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.status-pill {
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.status-pill.online { background: #D1FAE5; color: #065F46; }
.status-pill.offline { background: #FECACA; color: #991B1B; }
.status-pill.error { background: #FEF3C7; color: #92400E; }
.status-pill.loading { background: #E5E7EB; color: #4B5563; }

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.stat-value.highlight {
  color: #02478A;
}

.stat-value.truncate {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-value.text-success {
  color: #10B981;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #F3F4F6;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online { background: #10B981; }
.status-dot.offline { background: #EF4444; }
.status-dot.error { background: #F59E0B; }
.status-dot.loading {
  background: #9CA3AF;
  animation: pulse 1.5s ease-in-out infinite;
}

.status-time {
  font-size: 12px;
  color: #9CA3AF;
}

/* ===== 기술 스택 ===== */
.tech-section {
  margin-bottom: 40px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.tech-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #FFFFFF;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #F3F4F6;
  transition: all 0.2s ease;
}

.tech-card:hover {
  border-color: #02478A;
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.1);
}

.tech-icon-wrapper {
  width: 48px;
  height: 48px;
  background: #F0F6FF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tech-icon {
  font-size: 24px;
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tech-label {
  font-size: 12px;
  font-weight: 500;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-value {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

/* ===== 푸터 ===== */
.status-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #F3F4F6;
}

.update-time {
  font-size: 14px;
  color: #9CA3AF;
  margin: 0;
}

/* ===== 반응형 ===== */
@media (max-width: 768px) {
  .status-header {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .status-content {
    padding: 24px 20px;
  }

  .status-banner {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .banner-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .status-header {
    padding: 32px 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .status-content {
    padding: 20px 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .stat-value.truncate {
    max-width: 140px;
  }
}
</style>
