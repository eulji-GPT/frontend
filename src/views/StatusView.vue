<template>
  <div class="status-page">
    <HeaderSection />

    <main class="status-main">
      <!-- 페이지 타이틀 -->
      <div class="page-header">
        <span class="page-label">시스템 상태</span>
        <h1 class="page-title">을GPT 서비스 현황</h1>
        <p class="page-desc">실시간 서비스 상태를 확인하세요</p>
      </div>

      <!-- 전체 상태 배너 -->
      <section class="overall-banner" :class="overallStatusClass">
        <div class="banner-dot" :class="overallStatusClass"></div>
        <div class="banner-body">
          <h2 class="banner-title">{{ overallStatusTitle }}</h2>
          <p class="banner-desc">{{ overallStatusText }}</p>
        </div>
        <button class="refresh-btn" @click="refreshAll" :disabled="isRefreshing">
          <svg v-if="isRefreshing" class="refresh-icon spinning" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <svg v-else class="refresh-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <span>{{ isRefreshing ? '확인 중...' : '새로고침' }}</span>
        </button>
      </section>

      <!-- 서비스 카드 그리드 -->
      <section class="services-section">
        <h2 class="section-heading">서비스 상태</h2>
        <div class="services-grid">
          <!-- Backend API -->
          <article class="service-card" :class="getStatusClass(backendStatus)">
            <div class="card-top">
              <div class="service-icon-wrap backend">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </div>
              <span class="status-badge" :class="getStatusClass(backendStatus)">
                <span class="badge-dot" :class="getStatusClass(backendStatus)"></span>
                {{ getStatusText(backendStatus) }}
              </span>
            </div>
            <h3 class="service-name">Backend API</h3>
            <div class="card-details">
              <div class="detail-row">
                <span class="detail-label">엔드포인트</span>
                <span class="detail-value truncate">{{ backendUrl }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">응답 시간</span>
                <span class="detail-value accent">{{ backendResponseTime }}ms</span>
              </div>
              <div class="detail-row" v-if="backendInfo?.message">
                <span class="detail-label">메시지</span>
                <span class="detail-value">{{ backendInfo.message }}</span>
              </div>
            </div>
            <div class="card-bottom">
              <span class="update-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>

          <!-- AI-RAG Service -->
          <article class="service-card" :class="getStatusClass(aiRagStatus)">
            <div class="card-top">
              <div class="service-icon-wrap ai">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 14v4" />
                </svg>
              </div>
              <span class="status-badge" :class="getStatusClass(aiRagStatus)">
                <span class="badge-dot" :class="getStatusClass(aiRagStatus)"></span>
                {{ getStatusText(aiRagStatus) }}
              </span>
            </div>
            <h3 class="service-name">AI-RAG Service</h3>
            <div class="card-details">
              <div class="detail-row" v-if="aiRagUrl">
                <span class="detail-label">엔드포인트</span>
                <span class="detail-value truncate">{{ aiRagUrl }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">응답 시간</span>
                <span class="detail-value accent">{{ aiRagResponseTime }}ms</span>
              </div>
              <div class="detail-row" v-if="aiRagInfo?.model">
                <span class="detail-label">AI 모델</span>
                <span class="detail-value">{{ aiRagInfo.model }}</span>
              </div>
            </div>
            <div class="card-bottom">
              <span class="update-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>

          <!-- RAG System -->
          <article class="service-card" :class="getStatusClass(ragSystemStatus)">
            <div class="card-top">
              <div class="service-icon-wrap rag">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="9" y1="7" x2="16" y2="7" />
                  <line x1="9" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <span class="status-badge" :class="getStatusClass(ragSystemStatus)">
                <span class="badge-dot" :class="getStatusClass(ragSystemStatus)"></span>
                {{ getStatusText(ragSystemStatus) }}
              </span>
            </div>
            <h3 class="service-name">RAG System</h3>
            <div class="card-details">
              <div class="detail-row">
                <span class="detail-label">초기화 상태</span>
                <span class="detail-value" :class="{ 'text-success': ragSystemInfo?.initialized }">
                  {{ ragSystemInfo?.initialized ? '완료' : '미완료' }}
                </span>
              </div>
              <div class="detail-row" v-if="ragSystemInfo?.embedding_model">
                <span class="detail-label">임베딩 모델</span>
                <span class="detail-value truncate">{{ ragSystemInfo.embedding_model }}</span>
              </div>
              <div class="detail-row" v-if="ragSystemInfo?.document_count">
                <span class="detail-label">인덱싱 문서</span>
                <span class="detail-value accent">{{ ragSystemInfo.document_count?.toLocaleString() }}개</span>
              </div>
              <div class="detail-row" v-if="ragSystemInfo?.last_indexed">
                <span class="detail-label">마지막 인덱싱</span>
                <span class="detail-value">{{ formatIndexTime(ragSystemInfo.last_indexed) }}</span>
              </div>
              <div class="detail-row" v-if="ragSystemInfo?.llm_model">
                <span class="detail-label">LLM 모델</span>
                <span class="detail-value">{{ ragSystemInfo.llm_model }}</span>
              </div>
            </div>
            <div class="card-bottom">
              <span class="update-time">{{ lastUpdated || '확인 중...' }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- 하단 -->
      <div class="page-footer">
        <p class="footer-time" v-if="lastUpdated">마지막 업데이트: {{ lastUpdated }}</p>
        <button class="back-btn" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>
      </div>
    </main>

    <CommonFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getApiBaseUrl } from '@/utils/ports-config';
import HeaderSection from '../components/main/HeaderSection.vue';
import CommonFooter from '../components/common/CommonFooter.vue';

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

// URL 헬퍼 (중앙화된 ports-config에서 가져옴)
const getBackendUrl = getApiBaseUrl;

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

const formatIndexTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

const goBack = () => router.go(-1);

onMounted(() => refreshAll());
</script>

<style scoped>
/* ===== 기본 레이아웃 ===== */
.status-page {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: #f3f8ff;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.status-main {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px 40px;
}

/* ===== 페이지 헤더 ===== */
.page-header {
  margin-bottom: 40px;
}

.page-label {
  display: inline-block;
  color: #02478A;
  font-size: 16px;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 8px;
}

.page-title {
  color: #1F2937;
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  margin: 0 0 8px 0;
}

.page-desc {
  color: #6B7280;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

/* ===== 전체 상태 배너 ===== */
.overall-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border-radius: 20px;
  margin-bottom: 48px;
  transition: all 0.3s ease;
}

.overall-banner.healthy {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1px solid #A7F3D0;
}

.overall-banner.warning {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1px solid #FDE68A;
}

.overall-banner.critical {
  background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
  border: 1px solid #FECACA;
}

.overall-banner.loading {
  background: linear-gradient(135deg, #F0F6FF 0%, #E5E7EB 100%);
  border: 1px solid #D1D5DB;
}

.banner-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.banner-dot.healthy { background: #10B981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2); }
.banner-dot.warning { background: #F59E0B; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2); }
.banner-dot.critical { background: #EF4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
.banner-dot.loading {
  background: #9CA3AF;
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.2);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.banner-body {
  flex: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 2px 0;
  line-height: 140%;
}

.banner-desc {
  font-size: 14px;
  font-weight: 400;
  color: #6B7280;
  margin: 0;
}

/* ===== 새로고침 버튼 ===== */
.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #02478A;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(2, 71, 138, 0.25);
}

.refresh-btn:hover:not(:disabled) {
  background: #01386E;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.35);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  flex-shrink: 0;
}

.refresh-icon.spinning {
  animation: spin 0.8s linear infinite;
}

/* ===== 서비스 섹션 ===== */
.services-section {
  margin-bottom: 48px;
}

.section-heading {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 24px 0;
  line-height: 140%;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ===== 서비스 카드 ===== */
.service-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #F3F4F6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  transition: background 0.3s ease;
}

.service-card.online::before { background: #10B981; }
.service-card.offline::before { background: #EF4444; }
.service-card.error::before { background: #F59E0B; }
.service-card.loading::before { background: #9CA3AF; }

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-icon-wrap.backend {
  background: #F0F6FF;
  color: #02478A;
}

.service-icon-wrap.ai {
  background: #FFF7ED;
  color: #C2410C;
}

.service-icon-wrap.rag {
  background: #F0FDF4;
  color: #15803D;
}

/* ===== 상태 뱃지 ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.online { background: #ECFDF5; color: #065F46; }
.status-badge.offline { background: #FEF2F2; color: #991B1B; }
.status-badge.error { background: #FFFBEB; color: #92400E; }
.status-badge.loading { background: #F3F4F6; color: #4B5563; }

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge-dot.online { background: #10B981; }
.badge-dot.offline { background: #EF4444; }
.badge-dot.error { background: #F59E0B; }
.badge-dot.loading {
  background: #9CA3AF;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.service-name {
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 20px 0;
}

/* ===== 카드 상세 ===== */
.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 13px;
  font-weight: 500;
  color: #9CA3AF;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  text-align: right;
}

.detail-value.accent {
  color: #02478A;
}

.detail-value.truncate {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-value.text-success {
  color: #10B981;
}

.card-bottom {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
}

.update-time {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 400;
}

/* ===== 페이지 하단 ===== */
.page-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 32px;
  border-top: 1px solid #E5E7EB;
}

.footer-time {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #FFFFFF;
  color: #1F2937;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #F3F4F6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ===== 애니메이션 ===== */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 반응형: 태블릿 ===== */
@media (max-width: 1024px) {
  .status-main {
    padding: 48px 30px 30px;
  }

  .page-title {
    font-size: 30px;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ===== 반응형: 모바일 ===== */
@media (max-width: 768px) {
  .status-main {
    padding: 36px 20px 20px;
  }

  .page-title {
    font-size: 26px;
  }

  .page-desc {
    font-size: 14px;
  }

  .overall-banner {
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .section-heading {
    font-size: 20px;
  }

  .service-card {
    padding: 24px;
  }
}

/* ===== 반응형: 소형 모바일 ===== */
@media (max-width: 480px) {
  .status-main {
    padding: 28px 16px 16px;
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-label {
    font-size: 14px;
  }

  .page-title {
    font-size: 22px;
  }

  .overall-banner {
    border-radius: 16px;
    padding: 16px;
  }

  .banner-title {
    font-size: 17px;
  }

  .service-card {
    padding: 20px;
    border-radius: 16px;
  }

  .service-name {
    font-size: 16px;
  }

  .detail-value.truncate {
    max-width: 110px;
  }
}
</style>
