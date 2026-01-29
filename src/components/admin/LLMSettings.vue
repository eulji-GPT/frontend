<template>
  <div class="llm-settings">
    <h2 class="section-title">LLM 설정 관리</h2>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-button"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content: 프롬프트 템플릿 -->
    <div v-show="activeTab === 'prompts'" class="settings-layout">
      <!-- 프롬프트 템플릿 목록 -->
      <div class="templates-panel">
        <div class="panel-header">
          <h3>프롬프트 템플릿</h3>
          <div class="header-actions">
            <button class="apply-recommended-btn" @click="applyRecommendedParams" :disabled="loading" title="추천 설정 자동 적용">
              ✨
            </button>
            <button class="refresh-btn" @click="loadTemplates" :disabled="loading">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>로딩 중...</span>
        </div>

        <div v-else class="templates-list">
          <div
            v-for="(template, key) in templates"
            :key="key"
            class="template-card"
            :class="{ active: selectedTemplate === key }"
            @click="selectTemplate(key)"
          >
            <div class="template-info">
              <span class="template-name">
                {{ getTemplateName(key) }}
                <span v-if="useCustomParams[key]" class="custom-badge" title="개별 파라미터 사용 중">⚙️</span>
              </span>
              <span class="template-key">{{ key }}</span>
            </div>
            <div class="template-icon">
              {{ getTemplateIcon(key) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 프롬프트 편집기 -->
      <div class="editor-panel">
        <div v-if="selectedTemplate" class="editor-content">
          <div class="editor-header">
            <div class="editor-title">
              <h3>{{ getTemplateName(selectedTemplate) }}</h3>
              <span class="template-badge">{{ selectedTemplate }}</span>
            </div>
            <div class="editor-actions">
              <button class="action-btn reembed" @click="syncNotionData" :disabled="loading" title="Notion 데이터 재임베딩">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                </svg>
              </button>
              <button class="action-btn restart" @click="restartServices" :disabled="loading" title="AI 서비스 재시작">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                </svg>
              </button>
              <button class="action-btn reset" @click="resetTemplate" title="초기화">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
              <button class="action-btn save" @click="saveTemplate" :disabled="!hasChanges" title="저장">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div class="editor-body">
            <label class="editor-label">시스템 프롬프트</label>
            <textarea
              v-model="editingPrompt"
              class="prompt-editor"
              placeholder="프롬프트를 입력하세요..."
              @input="markAsChanged"
            ></textarea>

            <div class="prompt-stats">
              <span>{{ editingPrompt.length }} 글자</span>
              <span>{{ editingPrompt.split('\n').length }} 줄</span>
              <span v-if="hasChanges" class="unsaved-badge">저장되지 않음</span>
            </div>
          </div>

          <!-- 모델 설정 -->
          <div class="model-settings">
            <div class="settings-header">
              <h4>모델 설정</h4>
              <label class="custom-params-toggle">
                <input
                  type="checkbox"
                  v-model="useCustomParams[selectedTemplate]"
                  @change="toggleCustomParams(selectedTemplate)"
                />
                <span>이 프롬프트만의 개별 파라미터 사용</span>
              </label>
            </div>

            <!-- 전역 파라미터 (개별 파라미터 미사용 시) -->
            <div v-if="!useCustomParams[selectedTemplate]" class="settings-grid">
              <div class="setting-item">
                <label>Temperature (전역)</label>
                <input
                  type="range"
                  v-model.number="modelSettings.temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  @input="markAsChanged"
                />
                <span class="setting-value">{{ modelSettings.temperature.toFixed(1) }}</span>
              </div>
              <div class="setting-item">
                <label>Top-P (전역)</label>
                <input
                  type="range"
                  v-model.number="modelSettings.topP"
                  min="0"
                  max="1"
                  step="0.05"
                  @input="markAsChanged"
                />
                <span class="setting-value">{{ modelSettings.topP.toFixed(2) }}</span>
              </div>
              <div class="setting-item">
                <label>Max Tokens (전역)</label>
                <input
                  type="number"
                  v-model.number="modelSettings.maxTokens"
                  min="100"
                  max="8000"
                  step="100"
                  @input="markAsChanged"
                />
              </div>
            </div>

            <!-- 개별 파라미터 (사용 시) -->
            <div v-else-if="promptParams[selectedTemplate]" class="settings-grid">
              <div class="setting-item custom-param">
                <label>Temperature (개별)</label>
                <input
                  type="range"
                  v-model.number="promptParams[selectedTemplate]!.temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  @input="markAsChanged"
                />
                <span class="setting-value custom">{{ promptParams[selectedTemplate]!.temperature.toFixed(1) }}</span>
              </div>
              <div class="setting-item custom-param">
                <label>Top-P (개별)</label>
                <input
                  type="range"
                  v-model.number="promptParams[selectedTemplate]!.topP"
                  min="0"
                  max="1"
                  step="0.05"
                  @input="markAsChanged"
                />
                <span class="setting-value custom">{{ promptParams[selectedTemplate]!.topP.toFixed(2) }}</span>
              </div>
              <div class="setting-item custom-param">
                <label>Max Tokens (개별)</label>
                <input
                  type="number"
                  v-model.number="promptParams[selectedTemplate]!.maxTokens"
                  min="100"
                  max="8000"
                  step="100"
                  @input="markAsChanged"
                />
              </div>
            </div>

            <div v-if="useCustomParams[selectedTemplate]" class="custom-param-notice">
              ℹ️ 이 프롬프트는 개별 파라미터를 사용합니다. 전역 설정과 독립적으로 작동합니다.
            </div>
          </div>

          <!-- RAG 설정 -->
          <div class="rag-settings">
            <h4>RAG 설정</h4>
            <div class="settings-grid">
              <div class="setting-item">
                <label>Initial Top-K (검색 결과 수)</label>
                <input
                  type="range"
                  v-model.number="ragSettings.initial_top_k"
                  min="5"
                  max="50"
                  step="5"
                  @input="markAsChanged"
                />
                <span class="setting-value">{{ ragSettings.initial_top_k }}</span>
              </div>
              <div class="setting-item">
                <label>Final Top-K (최종 문서 수)</label>
                <input
                  type="range"
                  v-model.number="ragSettings.final_top_k"
                  min="1"
                  max="20"
                  step="1"
                  @input="markAsChanged"
                />
                <span class="setting-value">{{ ragSettings.final_top_k }}</span>
              </div>
              <div class="setting-item">
                <label>Alpha (Dense 가중치)</label>
                <input
                  type="range"
                  v-model.number="ragSettings.alpha"
                  min="0"
                  max="1"
                  step="0.1"
                  @input="markAsChanged"
                />
                <span class="setting-value">{{ ragSettings.alpha.toFixed(1) }}</span>
              </div>
            </div>

            <!-- 검색 방법 선택 -->
            <div class="search-method-section">
              <label class="section-label">검색 방법</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="ragSettings.search_method"
                    value="dense"
                    @change="markAsChanged"
                  />
                  <span>Dense (의미 기반)</span>
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="ragSettings.search_method"
                    value="sparse"
                    @change="markAsChanged"
                  />
                  <span>Sparse (키워드 기반)</span>
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="ragSettings.search_method"
                    value="hybrid"
                    @change="markAsChanged"
                  />
                  <span>Hybrid (혼합)</span>
                </label>
              </div>
            </div>

            <!-- 리랭커 옵션 -->
            <div class="reranker-section">
              <label class="section-label">리랭커 옵션</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="ragSettings.use_reranker"
                    @change="markAsChanged"
                  />
                  <span>기본 리랭커 사용</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="ragSettings.use_llm_reranker"
                    @change="markAsChanged"
                  />
                  <span>LLM 리랭커 사용 (느리지만 정확)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 변수 힌트 -->
          <div class="variable-hints">
            <h4>사용 가능한 변수</h4>
            <div class="hint-tags">
              <span class="hint-tag" v-for="variable in getTemplateVariables(selectedTemplate)" :key="variable">
                {{ variable }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="select-prompt">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>왼쪽에서 편집할 프롬프트를 선택하세요</p>
        </div>
      </div>
    </div>

    <!-- Admin 페이지 간소화: Tool, Notion, Quality 탭 제거됨 -->

    <!-- 저장 확인 모달 -->
    <div v-if="showSaveModal" class="modal-overlay" @click.self="showSaveModal = false">
      <div class="modal-content">
        <h3>변경 사항 저장</h3>
        <p>프롬프트 변경 사항을 저장하시겠습니까?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showSaveModal = false">취소</button>
          <button class="confirm-btn" @click="confirmSave">저장</button>
        </div>
      </div>
    </div>

    <!-- 토스트 알림 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { aiSettingsAPI } from '@/services/api'
import type { RAGConfig, ModelParams } from '@/services/api'
// Admin 페이지 간소화: Tool, Notion, Quality 탭 제거

interface ModelSettings {
  temperature: number
  topP: number
  maxTokens: number
}

// Tab 설정
// Admin 페이지 간소화: 프롬프트 템플릿만 표시
const tabs = [
  { key: 'prompts', label: '프롬프트 및 모델 설정', icon: '📝' }
]
const activeTab = ref('prompts')

// 프롬프트 템플릿 (기본값)
const defaultTemplates: Record<string, string> = {
  university: `당신은 '을지(Eulji)'라는 이름의 을지대학교 전용 AI 어시스턴트입니다.

## 핵심 역할
- 대학 생활 관련 모든 질문에 친절하고 정확하게 답변
- 학사 일정, 시설 정보, 학교 규정 등에 대한 전문적인 안내
- 친근하면서도 존중하는 어조 유지

## 답변 지침
1. 항상 한국어로 답변하세요
2. 정확한 정보만 제공하고, 불확실한 경우 솔직히 밝히세요
3. 필요시 관련 부서나 연락처를 안내하세요
4. 간결하면서도 완전한 답변을 제공하세요`,

  study: `당신은 '을지(Eulji)'라는 이름의 학습 도우미 AI입니다.

## 핵심 역할
- 학습 질문에 대한 명확하고 교육적인 답변 제공
- 개념 설명, 문제 풀이 도움, 학습 전략 조언
- 학생의 이해도에 맞춘 맞춤형 설명

## 답변 지침
1. 단계별로 명확하게 설명하세요
2. 예시와 비유를 활용하여 이해를 도우세요
3. 학생이 스스로 생각할 수 있도록 유도하세요
4. 관련 추가 학습 자료가 있다면 언급하세요`,

  career: `당신은 '을지(Eulji)'라는 이름의 진로 상담 AI입니다.

## 핵심 역할
- 진로 탐색 및 취업 준비 관련 조언 제공
- 학과별 진로 경로 안내
- 이력서, 면접 준비 등 실질적인 조언

## 답변 지침
1. 개인의 관심사와 강점을 고려한 조언 제공
2. 현실적이고 실용적인 정보 위주로 답변
3. 다양한 가능성을 열어두고 안내
4. 격려와 동기부여를 담은 어조 유지`,

  cot: `당신은 복잡한 질문에 대해 단계적으로 사고하는 AI입니다.

## Chain of Thought 프로세스
1. 질문 분석: 핵심 요소와 요구사항 파악
2. 하위 질문 분해: 복잡한 질문을 작은 단위로 나눔
3. 단계별 추론: 각 하위 질문에 대해 논리적 사고
4. 종합 결론: 모든 분석을 통합하여 최종 답변 도출

## 출력 형식
각 단계를 명확하게 구분하여 사고 과정을 투명하게 보여주세요.`,

  general: `당신은 '을지(Eulji)'라는 이름의 친절한 AI 어시스턴트입니다.

## 핵심 역할
- 다양한 주제에 대한 일반적인 대화 및 질의응답
- 정보 제공, 아이디어 논의, 일상 대화

## 답변 지침
1. 친근하고 대화하기 편한 어조 유지
2. 정확하고 유용한 정보 제공
3. 필요시 추가 질문으로 맥락 파악
4. 항상 한국어로 답변`
}

// 상태
const templates = ref<Record<string, string>>({})
const selectedTemplate = ref<string | null>(null)
const editingPrompt = ref('')
const originalPrompt = ref('')
const loading = ref(false)
const showSaveModal = ref(false)
const hasChanges = ref(false)

const modelSettings = reactive<ModelSettings>({
  temperature: 0.3,  // 최적화된 Agent 기본값 (정확도 향상)
  topP: 0.9,
  maxTokens: 4000
})

// 프롬프트별 개별 파라미터
const promptParams = ref<Record<string, ModelSettings | null>>({
  university: null,
  study: null,
  career: null,
  cot: null,
  general: null
})

// 프롬프트별 개별 파라미터 사용 여부
const useCustomParams = ref<Record<string, boolean>>({
  university: false,
  study: false,
  career: false,
  cot: false,
  general: false
})

const ragSettings = reactive<RAGConfig>({
  initial_top_k: 15,
  final_top_k: 5,
  search_method: 'hybrid',
  alpha: 0.5,
  use_reranker: true,
  use_llm_reranker: false
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning'
})

// 템플릿 이름 매핑
const templateNames: Record<string, string> = {
  university: '대학생 챗봇',
  study: '학습 도우미',
  career: '진로 상담사',
  cot: 'Chain of Thought',
  general: '일반 채팅'
}

// 템플릿 아이콘 매핑
const templateIcons: Record<string, string> = {
  university: '🎓',
  study: '📚',
  career: '💼',
  cot: '🧠',
  general: '💬'
}

// 템플릿별 변수
const templateVariables: Record<string, string[]> = {
  university: ['{context}', '{question}', '{user_name}'],
  study: ['{subject}', '{question}', '{difficulty}'],
  career: ['{major}', '{interests}', '{question}'],
  cot: ['{question}', '{context}'],
  general: ['{message}', '{context}']
}

const getTemplateName = (key: string) => templateNames[key] || key
const getTemplateIcon = (key: string) => templateIcons[key] || '📝'
const getTemplateVariables = (key: string) => templateVariables[key] || []

const loadTemplates = async () => {
  loading.value = true
  try {
    // Backend API에서 모든 설정 동시 로드
    const [promptsData, ragConfigData, modelParamsData] = await Promise.all([
      aiSettingsAPI.getPrompts(),
      aiSettingsAPI.getRAGConfig(),
      aiSettingsAPI.getModelParams()
    ])

    // 프롬프트 템플릿 적용
    templates.value = { ...defaultTemplates, ...promptsData }

    // RAG 설정 적용
    Object.assign(ragSettings, ragConfigData)

    // 모델 파라미터 적용
    modelSettings.temperature = modelParamsData.temperature
    modelSettings.topP = modelParamsData.top_p
    modelSettings.maxTokens = modelParamsData.max_tokens

    // 각 프롬프트별 개별 파라미터 로드
    for (const key of Object.keys(templates.value)) {
      try {
        const params = await aiSettingsAPI.getPromptParams(key)
        if (params && (params.temperature !== undefined || params.max_tokens !== undefined || params.top_p !== undefined)) {
          // 개별 파라미터가 설정되어 있으면 로드
          promptParams.value[key] = {
            temperature: params.temperature ?? modelSettings.temperature,
            topP: params.top_p ?? modelSettings.topP,
            maxTokens: params.max_tokens ?? modelSettings.maxTokens
          }
          useCustomParams.value[key] = true
        }
      } catch (error) {
        // 개별 파라미터가 없는 경우 무시 (전역 파라미터 사용)
        console.log(`No custom params for ${key}`)
      }
    }

    console.log('✅ 설정 로드 완료:', {
      prompts: Object.keys(promptsData).length,
      ragConfig: ragConfigData,
      modelParams: modelParamsData,
      customParams: Object.keys(promptParams.value).filter(k => useCustomParams.value[k]).length
    })
  } catch (error) {
    console.error('설정 로드 실패:', error)
    showToast('설정 로드에 실패했습니다. 기본값을 사용합니다.', 'error')
    templates.value = { ...defaultTemplates }
  } finally {
    loading.value = false
  }
}

const selectTemplate = (key: string) => {
  if (hasChanges.value) {
    if (!confirm('저장되지 않은 변경 사항이 있습니다. 계속하시겠습니까?')) {
      return
    }
  }

  selectedTemplate.value = key
  editingPrompt.value = templates.value[key] || ''
  originalPrompt.value = editingPrompt.value
  hasChanges.value = false
}

const markAsChanged = () => {
  hasChanges.value = editingPrompt.value !== originalPrompt.value
}

const resetTemplate = () => {
  if (!selectedTemplate.value) return

  if (confirm('이 프롬프트를 기본값으로 초기화하시겠습니까?')) {
    editingPrompt.value = defaultTemplates[selectedTemplate.value] || ''
    hasChanges.value = editingPrompt.value !== originalPrompt.value
  }
}

const saveTemplate = () => {
  showSaveModal.value = true
}

const confirmSave = async () => {
  if (!selectedTemplate.value) return

  try {
    // 1. 프롬프트 템플릿 + 개별 파라미터 업데이트
    const currentParams = promptParams.value[selectedTemplate.value]
    const shouldUseCustom = useCustomParams.value[selectedTemplate.value]

    const promptResponse = await aiSettingsAPI.updatePrompt(
      selectedTemplate.value,
      {
        template: editingPrompt.value,
        params: shouldUseCustom && currentParams ? {
          temperature: currentParams.temperature,
          max_tokens: currentParams.maxTokens,
          top_p: currentParams.topP
        } : undefined
      }
    )

    // 2. 전역 모델 파라미터 업데이트
    const modelParamsResponse = await aiSettingsAPI.updateModelParams({
      temperature: modelSettings.temperature,
      max_tokens: modelSettings.maxTokens,
      top_p: modelSettings.topP
    })

    // 3. RAG 설정 업데이트
    const ragConfigResponse = await aiSettingsAPI.updateRAGConfig(ragSettings)

    // 로컬 상태 업데이트
    templates.value[selectedTemplate.value] = editingPrompt.value
    originalPrompt.value = editingPrompt.value
    hasChanges.value = false
    showSaveModal.value = false

    // 207 Multi-Status 응답 처리
    const has207 = [promptResponse, modelParamsResponse, ragConfigResponse]
      .some(r => r.status === 'partial')

    if (has207) {
      showToast('설정이 저장되었으나 AI 서비스 반영에 실패했습니다. 수동 재시작이 필요할 수 있습니다.', 'warning')
    } else {
      showToast('모든 설정이 성공적으로 저장되었습니다', 'success')
    }

    console.log('✅ 설정 저장 완료:', {
      prompt: promptResponse.status,
      modelParams: modelParamsResponse.status,
      ragConfig: ragConfigResponse.status
    })
  } catch (error) {
    console.error('저장 실패:', error)
    showToast('저장에 실패했습니다. 다시 시도해주세요.', 'error')
  }
}

const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
  toast.message = message
  toast.type = type
  toast.show = true

  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// 개별 파라미터 토글
const toggleCustomParams = async (promptName: string) => {
  const enabled = useCustomParams.value[promptName]

  if (enabled && !promptParams.value[promptName]) {
    // 처음 활성화하는 경우: 전역 파라미터 복사
    promptParams.value[promptName] = {
      temperature: modelSettings.temperature,
      topP: modelSettings.topP,
      maxTokens: modelSettings.maxTokens
    }
  }
}

// Notion 데이터 재임베딩
const syncNotionData = async () => {
  if (!confirm('Notion 데이터를 재임베딩하시겠습니까?\n\n시간이 다소 걸릴 수 있습니다.')) return

  loading.value = true
  try {
    const response = await aiSettingsAPI.syncNotion()

    if (response.success) {
      showToast(
        `✅ ${response.message}\n` +
        `Notion: ${response.stats.notion_documents}개, ` +
        `로컬: ${response.stats.local_documents}개, ` +
        `총: ${response.stats.total_documents}개`,
        'success'
      )
    } else {
      showToast('재임베딩에 실패했습니다.', 'error')
    }
  } catch (error) {
    console.error('재임베딩 실패:', error)
    showToast('재임베딩 중 오류가 발생했습니다.', 'error')
  } finally {
    loading.value = false
  }
}

// 서버 재시작
const restartServices = async () => {
  if (!confirm('AI 서비스를 재시작하시겠습니까?')) return

  loading.value = true
  try {
    const response = await aiSettingsAPI.restartServices()

    // Handle both full success (200) and partial success (207)
    if (response.status === 'success') {
      showToast(response.message || 'AI 서비스가 재시작되었습니다', 'success')
    } else if (response.status === 'partial') {
      showToast(response.message || '설정 저장됨 (재시작 실패)', 'warning')
    } else {
      showToast(response.message || 'AI 서비스가 재시작되었습니다', 'success')
    }
  } catch (error) {
    console.error('서버 재시작 실패:', error)
    showToast('서버 재시작에 실패했습니다', 'error')
  } finally {
    loading.value = false
  }
}

// 추천 파라미터 자동 적용
const applyRecommendedParams = async () => {
  if (!confirm('모든 프롬프트에 추천 파라미터를 적용하시겠습니까?\n\n각 모드에 최적화된 설정이 자동으로 적용됩니다.')) return

  loading.value = true

  // 추천 파라미터 (정확도 최적화)
  const recommendedParams = {
    university: { temperature: 0.3, max_tokens: 2048, top_p: 0.9 },  // 정확한 학교 정보 전달
    study: { temperature: 0.3, max_tokens: 3072, top_p: 0.9 },       // 정확한 학습 지도
    career: { temperature: 0.4, max_tokens: 2560, top_p: 0.9 },      // 진로 조언은 약간의 창의성
    cot: { temperature: 0.3, max_tokens: 4096, top_p: 0.85 },        // 논리적 추론의 일관성
    general: { temperature: 0.3, max_tokens: 2048, top_p: 0.9 }      // 일반 대화도 정확도 우선
  }

  try {
    let successCount = 0
    let failCount = 0

    // 각 프롬프트에 추천 파라미터 적용
    for (const [promptName, params] of Object.entries(recommendedParams)) {
      try {
        await aiSettingsAPI.updatePromptParams(promptName, params)

        // 로컬 상태 업데이트
        promptParams.value[promptName] = {
          temperature: params.temperature,
          topP: params.top_p,
          maxTokens: params.max_tokens
        }
        useCustomParams.value[promptName] = true

        successCount++
      } catch (error) {
        console.error(`Failed to apply params for ${promptName}:`, error)
        failCount++
      }
    }

    // 결과 알림
    if (failCount === 0) {
      showToast(`✨ 추천 파라미터가 모두 적용되었습니다! (${successCount}개)`, 'success')

      // 서비스 재시작 제안
      setTimeout(() => {
        if (confirm('AI 서비스를 재시작하여 변경사항을 적용하시겠습니까?')) {
          restartServices()
        }
      }, 1000)
    } else {
      showToast(`일부 설정 적용에 실패했습니다. (성공: ${successCount}, 실패: ${failCount})`, 'warning')
    }

  } catch (error) {
    console.error('추천 파라미터 적용 실패:', error)
    showToast('추천 파라미터 적용에 실패했습니다', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.llm-settings {
  max-width: 1400px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  bottom: -2px;
}

.tab-button:hover {
  color: #02478A;
  background: #f0f9ff;
  border-radius: 8px 8px 0 0;
}

.tab-button.active {
  color: #02478A;
  border-bottom-color: #02478A;
  background: transparent;
}

.settings-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

/* 템플릿 패널 */
.templates-panel {
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

.header-actions {
  display: flex;
  gap: 8px;
}

.apply-recommended-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  animation: sparkle 2s ease-in-out infinite;
}

.apply-recommended-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.apply-recommended-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  animation: none;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.refresh-btn {
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

.refresh-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.templates-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.template-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: #f9fafb;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.template-card.active {
  background: #eff6ff;
  border-color: #02478A;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-badge {
  font-size: 12px;
  opacity: 0.8;
}

.template-key {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.template-icon {
  font-size: 24px;
}

/* 편집기 패널 */
.editor-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.template-badge {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
}

.editor-actions {
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

.action-btn.reembed {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: #fff;
}

.action-btn.reembed:hover:not(:disabled) {
  background: #7c3aed;
}

.action-btn.reembed:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.restart {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}

.action-btn.restart:hover:not(:disabled) {
  background: #059669;
}

.action-btn.restart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.reset:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #d97706;
}

.action-btn.save {
  background: #02478A;
  border-color: #02478A;
  color: #fff;
}

.action-btn.save:hover:not(:disabled) {
  background: #023a6e;
}

.action-btn.save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.editor-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.prompt-editor {
  flex: 1;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
}

.prompt-editor:focus {
  border-color: #02478A;
}

.prompt-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.unsaved-badge {
  color: #f59e0b;
  font-weight: 500;
}

/* 모델 설정 */
.model-settings {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.model-settings h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.custom-params-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 13px;
}

.custom-params-toggle:hover {
  border-color: #02478A;
  background: #f0f9ff;
}

.custom-params-toggle input[type="checkbox"] {
  accent-color: #02478A;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.custom-param-notice {
  margin-top: 12px;
  padding: 10px 14px;
  background: #dbeafe;
  border-left: 3px solid #02478A;
  border-radius: 6px;
  font-size: 13px;
  color: #1e40af;
}

.setting-item.custom-param label {
  color: #02478A;
  font-weight: 600;
}

.setting-value.custom {
  color: #059669;
  font-weight: 700;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 13px;
  color: #6b7280;
}

.setting-item input[type="range"] {
  width: 100%;
  accent-color: #02478A;
}

.setting-item input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.setting-value {
  font-size: 14px;
  font-weight: 600;
  color: #02478A;
  text-align: center;
}

/* RAG 설정 */
.rag-settings {
  background: #fef3c7;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.rag-settings h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
}

.search-method-section,
.reranker-section {
  margin-top: 20px;
}

.radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 16px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.radio-label:hover {
  border-color: #02478A;
  background: #f0f9ff;
}

.radio-label input[type="radio"] {
  accent-color: #02478A;
  cursor: pointer;
}

.radio-label span {
  font-size: 14px;
  color: #374151;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 16px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.checkbox-label:hover {
  border-color: #02478A;
  background: #f0f9ff;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #02478A;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.checkbox-label span {
  font-size: 14px;
  color: #374151;
}

/* 변수 힌트 */
.variable-hints {
  background: #f0f9ff;
  border-radius: 10px;
  padding: 16px;
}

.variable-hints h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.hint-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-tag {
  font-size: 12px;
  font-family: monospace;
  color: #0369a1;
  background: #e0f2fe;
  padding: 4px 10px;
  border-radius: 4px;
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
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

.confirm-btn {
  padding: 10px 20px;
  background: #02478A;
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

.toast.warning {
  background: #f59e0b;
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
@media (max-width: 900px) {
  .settings-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .templates-panel {
    max-height: 250px;
  }

  .editor-panel {
    min-height: 500px;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
