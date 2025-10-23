<template>
  <div class="rag-initializer" v-if="showRagInitializer">
    <div class="rag-status-card" :class="{ 'initialized': ragStatus.initialized, 'error': ragStatus.error }">
      <div class="rag-header">
        <div class="rag-icon">
          <span v-if="ragStatus.initialized">🟢</span>
          <span v-else-if="ragStatus.isInitializing">🟡</span>
          <span v-else>🔴</span>
        </div>
        <div class="rag-title">
          <h3>을지대 정보검색</h3>
          <span class="rag-subtitle">을지대학교 공식 자료 검색</span>
        </div>
        <div class="rag-actions">
          <button 
            v-if="!ragStatus.initialized && !ragStatus.isInitializing" 
            @click="handleInitialize" 
            class="init-button"
          >
            초기화
          </button>
          <button 
            v-if="ragStatus.initialized" 
            @click="handleRefresh" 
            class="refresh-button"
          >
            새로고침
          </button>
        </div>
      </div>
      
      <div class="rag-content">
        <div v-if="ragStatus.isInitializing" class="loading-state">
          <div class="loading-spinner"></div>
          <p>을지대 정보검색 시스템을 초기화하고 있습니다...</p>
          <small>최초 실행 시 몇 분이 소요될 수 있습니다.</small>
        </div>
        
        <div v-else-if="ragStatus.initialized && ragStatus.systemInfo" class="success-state">
          <div class="system-info">
            <div class="info-item">
              <span class="label">임베딩 모델:</span>
              <span class="value">{{ ragStatus.systemInfo.embedding_model }}</span>
            </div>
            <div class="info-item">
              <span class="label">언어 모델:</span>
              <span class="value">{{ ragStatus.systemInfo.llm_model }}</span>
            </div>
            <div class="info-item">
              <span class="label">문서 수:</span>
              <span class="value">{{ ragStatus.systemInfo.document_count?.toLocaleString() }}개</span>
            </div>
            <div class="info-item">
              <span class="label">임베딩 차원:</span>
              <span class="value">{{ ragStatus.systemInfo.embedding_dimension }}차원</span>
            </div>
            <div class="info-item">
              <span class="label">디바이스:</span>
              <span class="value">{{ ragStatus.systemInfo.device_id }}</span>
            </div>
          </div>
          <p class="ready-message">✅ 을지대 정보검색을 사용할 수 있습니다!</p>
        </div>
        
        <div v-else-if="ragStatus.error" class="error-state">
          <p class="error-message">❌ {{ ragStatus.error }}</p>
          <button @click="handleInitialize" class="retry-button">다시 시도</button>
        </div>
        
        <div v-else class="init-state">
          <p>을지대 정보검색 시스템이 초기화되지 않았습니다.</p>
          <p class="init-description">
            을지대학교 공식 자료 검색을 사용하려면 시스템을 초기화해야 합니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useChat } from '../../composables/useChat'

const { ragStatus, checkRagStatus, initializeRag, chatMode } = useChat()

// 을지대 정보검색 모드일 때만 초기화 UI 표시
const showRagInitializer = computed(() => {
  return chatMode.value === 'rag'
})

const handleInitialize = async () => {
  await initializeRag()
}

const handleRefresh = async () => {
  await checkRagStatus()
}

// 컴포넌트 마운트 시 RAG 상태 확인 및 자동 초기화 시도
onMounted(async () => {
  if (showRagInitializer.value) {
    await checkRagStatus()

    // 초기화되지 않았으면 자동으로 초기화 시도
    if (!ragStatus.value.initialized && !ragStatus.value.isInitializing) {
      console.log('🔄 RAG 컴포넌트 마운트 - 자동 초기화 시작')
      await initializeRag()
    }
  }
})

// 을지대 정보검색 모드로 변경될 때마다 상태 확인 및 자동 초기화 시도
watch(showRagInitializer, async (newValue) => {
  if (newValue) {
    await checkRagStatus()

    // 초기화되지 않았으면 자동으로 초기화 시도
    if (!ragStatus.value.initialized && !ragStatus.value.isInitializing) {
      console.log('🔄 RAG 모드 진입 - 자동 초기화 시작')
      await initializeRag()
    }
  }
})
</script>

<style scoped>
.rag-initializer {
  margin-bottom: 16px;
}

.rag-status-card {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 2px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.rag-status-card.initialized {
  background: linear-gradient(145deg, #d4edda, #c3e6cb);
  border-color: #28a745;
}

.rag-status-card.error {
  background: linear-gradient(145deg, #f8d7da, #f5c6cb);
  border-color: #dc3545;
}

.rag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.rag-icon {
  font-size: 24px;
  margin-right: 12px;
}

.rag-title {
  flex: 1;
}

.rag-title h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.rag-subtitle {
  font-size: 14px;
  color: #6c757d;
}

.rag-actions {
  display: flex;
  gap: 8px;
}

.init-button, .refresh-button, .retry-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.init-button {
  background: #007bff;
  color: white;
}

.init-button:hover {
  background: #0056b3;
}

.refresh-button {
  background: #28a745;
  color: white;
}

.refresh-button:hover {
  background: #218838;
}

.retry-button {
  background: #dc3545;
  color: white;
  margin-top: 12px;
}

.retry-button:hover {
  background: #c82333;
}

.rag-content {
  border-top: 1px solid #dee2e6;
  padding-top: 16px;
}

.loading-state {
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto 16px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #007bff;
}

.loading-state small {
  color: #6c757d;
}

.success-state .system-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  font-size: 14px;
}

.info-item .label {
  font-weight: 500;
  color: #495057;
}

.info-item .value {
  color: #212529;
  font-weight: 600;
}

.ready-message {
  text-align: center;
  font-weight: 600;
  color: #28a745;
  margin: 0;
}

.error-state {
  text-align: center;
  padding: 20px;
}

.error-message {
  color: #dc3545;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.init-state {
  text-align: center;
  padding: 20px;
}

.init-state p {
  margin: 0 0 12px 0;
  color: #495057;
}

.init-description {
  font-size: 14px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .rag-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .success-state .system-info {
    grid-template-columns: 1fr;
  }
}
</style>