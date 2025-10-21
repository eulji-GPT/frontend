<template>
  <div v-if="artifact" class="artifact-panel" :style="{ width: panelWidth + 'px' }">
    <!-- 리사이즈 핸들 -->
    <div
      class="resize-handle"
      @mousedown="startResize"
      @touchstart="startResize"
    >
      <div class="resize-indicator"></div>
    </div>

    <div class="artifact-header">
      <div class="header-left">
        <span class="artifact-icon">📄</span>
        <span class="artifact-title">{{ artifact.title || '상세 보고서' }}</span>
      </div>
      <button class="close-button" @click="$emit('close')" aria-label="닫기">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 액션 버튼 툴바 -->
    <div class="action-toolbar">
      <button class="action-btn copy-btn" @click="copyContent" :title="copySuccess ? '복사됨!' : '복사하기'">
        <svg v-if="!copySuccess" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span>{{ copySuccess ? '복사됨!' : '복사하기' }}</span>
      </button>

      <button class="action-btn pdf-btn" @click="exportToPDF" :disabled="isExporting">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
        <span>{{ isExporting ? 'PDF 생성중...' : 'PDF로 저장' }}</span>
      </button>

      <button class="action-btn edit-btn" @click="toggleEditMode">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>{{ isEditing ? '저장' : '수정하기' }}</span>
      </button>

      <button class="action-btn regenerate-btn" @click="handleRegenerate" :disabled="isRegenerating">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23,4 23,10 17,10"></polyline>
          <polyline points="1,20 1,14 7,14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
        <span>{{ isRegenerating ? '재생성 중...' : '재생성하기' }}</span>
      </button>

      <!-- 버전 히스토리 버튼 -->
      <button
        v-if="artifact?.versions && artifact.versions.length > 1"
        class="action-btn version-btn"
        @click="showVersionHistory = !showVersionHistory"
        :title="`버전 ${artifact.versions.length}개`"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
        <span>버전 ({{ artifact.versions.length }})</span>
      </button>
    </div>

    <!-- 버전 히스토리 패널 -->
    <div v-if="showVersionHistory" class="version-history-panel">
      <div class="version-history-header">
        <h4>버전 히스토리</h4>
        <button class="close-version-btn" @click="showVersionHistory = false">✕</button>
      </div>
      <div class="version-list">
        <div
          v-for="(version, index) in artifact?.versions"
          :key="index"
          class="version-item"
          :class="{ active: artifact?.currentVersion === index }"
          @click="switchVersion(index)"
        >
          <div class="version-info">
            <span class="version-number">버전 {{ index + 1 }}</span>
            <span class="version-description">{{ version.description }}</span>
          </div>
          <span class="version-time">{{ formatTime(version.timestamp) }}</span>
        </div>
      </div>
    </div>

    <div class="artifact-content" ref="contentRef">
      <div
        v-if="!isEditing"
        v-html="renderedContent"
        class="markdown-content"
        @mouseup="handleTextSelection"
      ></div>
      <textarea
        v-else
        v-model="editableContent"
        class="edit-textarea"
        placeholder="내용을 수정하세요..."
      ></textarea>

      <!-- 텍스트 선택 팝오버 -->
      <div
        v-if="selectedText && !isEditing"
        class="text-selection-popover"
        :style="popoverStyle"
      >
        <button class="popover-btn improve-btn" @click="handleImproveSelection" :disabled="isProcessingSelection">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
          </svg>
          {{ isProcessingSelection ? 'AI 수정 중...' : 'AI로 개선' }}
        </button>
        <button class="popover-btn cancel-btn" @click="clearSelection">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

// marked 설정
marked.use({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

interface ArtifactVersion {
  content: string;
  timestamp: number;
  description?: string;
}

interface Artifact {
  title?: string;
  content: string;
  type?: string;
  versions?: ArtifactVersion[];
  currentVersion?: number;
}

const props = defineProps<{
  artifact?: Artifact | null;
}>();

const emit = defineEmits(['close', 'update', 'regenerate', 'improveSelection']);

// 상태 관리
const copySuccess = ref(false);
const isExporting = ref(false);
const isEditing = ref(false);
const editableContent = ref('');
const contentRef = ref<HTMLElement | null>(null);
const isRegenerating = ref(false);
const showVersionHistory = ref(false);

// 텍스트 선택 관련
const selectedText = ref('');
const selectedRange = ref<Range | null>(null);
const popoverStyle = ref({});
const isProcessingSelection = ref(false);

// 리사이즈 관련
const panelWidth = ref(500);
const isResizing = ref(false);
const MIN_WIDTH = 300;
const MAX_WIDTH = 900;

// 렌더링된 콘텐츠
const renderedContent = computed(() => {
  if (props.artifact?.content) {
    const result = marked(props.artifact.content);
    return typeof result === 'string' ? result : result;
  }
  return '';
});

// 복사 기능
const copyContent = async () => {
  try {
    const textToCopy = props.artifact?.content || '';
    await navigator.clipboard.writeText(textToCopy);
    copySuccess.value = true;
    console.log('✅ 아티팩트 내용이 클립보드에 복사되었습니다.');

    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('복사 실패:', err);
    // 폴백: 텍스트 선택 방식
    fallbackCopy();
  }
};

// 복사 폴백 함수
const fallbackCopy = () => {
  const textArea = document.createElement('textarea');
  textArea.value = props.artifact?.content || '';
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copySuccess.value = true;
      console.log('✅ 아티팩트 내용이 클립보드에 복사되었습니다. (폴백)');
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    }
  } catch (err) {
    console.error('폴백 복사도 실패:', err);
    alert('복사에 실패했습니다. 수동으로 복사해주세요.');
  }

  document.body.removeChild(textArea);
};

// PDF 저장 기능
const exportToPDF = async () => {
  if (!contentRef.value || isExporting.value) return;

  isExporting.value = true;
  console.log('📄 PDF 생성 시작...');

  try {
    // PDF로 변환할 요소 찾기
    const element = contentRef.value.querySelector('.markdown-content');
    if (!element) {
      throw new Error('콘텐츠를 찾을 수 없습니다.');
    }

    const title = props.artifact?.title || '상세_보고서';
    const filename = `${title.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    await html2pdf().set(opt).from(element).save();
    console.log('✅ PDF 저장 완료:', filename);
  } catch (err) {
    console.error('PDF 저장 실패:', err);
    alert('PDF 저장에 실패했습니다.');
  } finally {
    isExporting.value = false;
  }
};

// 수정 모드 토글
const toggleEditMode = () => {
  if (isEditing.value) {
    // 저장 모드 - 새 버전 생성
    const newVersion: ArtifactVersion = {
      content: editableContent.value,
      timestamp: Date.now(),
      description: '수동 수정'
    };

    const updatedArtifact = {
      ...props.artifact,
      content: editableContent.value,
      versions: [...(props.artifact?.versions || []), newVersion],
      currentVersion: (props.artifact?.versions?.length || 0)
    };

    emit('update', updatedArtifact);
    console.log('✅ 아티팩트 내용이 수정되었습니다.');
  } else {
    // 수정 모드로 전환
    editableContent.value = props.artifact?.content || '';
  }
  isEditing.value = !isEditing.value;
};

// 텍스트 선택 처리
const handleTextSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim().length === 0) {
    clearSelection();
    return;
  }

  const text = selection.toString().trim();
  if (text.length < 3) {
    clearSelection();
    return;
  }

  selectedText.value = text;
  selectedRange.value = selection.getRangeAt(0);

  // 팝오버 위치 계산
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const contentRect = contentRef.value?.getBoundingClientRect();

  if (contentRect) {
    popoverStyle.value = {
      position: 'absolute',
      top: `${rect.top - contentRect.top - 45}px`,
      left: `${rect.left - contentRect.left + (rect.width / 2) - 75}px`
    };
  }
};

// 선택 해제
const clearSelection = () => {
  selectedText.value = '';
  selectedRange.value = null;
  window.getSelection()?.removeAllRanges();
};

// 선택된 텍스트 AI 개선
const handleImproveSelection = async () => {
  if (!selectedText.value || !props.artifact) return;

  isProcessingSelection.value = true;
  console.log('🤖 AI로 텍스트 개선 중:', selectedText.value.substring(0, 50));

  try {
    // 부모 컴포넌트에 이벤트 전달 (AI API 호출은 부모에서 처리)
    emit('improveSelection', {
      selectedText: selectedText.value,
      fullContent: props.artifact.content
    });

    clearSelection();
  } catch (error) {
    console.error('텍스트 개선 실패:', error);
    alert('텍스트 개선에 실패했습니다.');
  } finally {
    isProcessingSelection.value = false;
  }
};

// 재생성 처리
const handleRegenerate = async () => {
  if (!props.artifact) return;

  const confirmed = confirm('아티팩트를 완전히 재생성하시겠습니까? 현재 내용은 버전으로 저장됩니다.');
  if (!confirmed) return;

  isRegenerating.value = true;
  console.log('🔄 아티팩트 재생성 시작...');

  try {
    emit('regenerate', props.artifact);
  } catch (error) {
    console.error('재생성 실패:', error);
    alert('재생성에 실패했습니다.');
  } finally {
    isRegenerating.value = false;
  }
};

// 버전 전환
const switchVersion = (versionIndex: number) => {
  if (!props.artifact?.versions || !props.artifact.versions[versionIndex]) return;

  const version = props.artifact.versions[versionIndex];
  const updatedArtifact = {
    ...props.artifact,
    content: version.content,
    currentVersion: versionIndex
  };

  emit('update', updatedArtifact);
  console.log(`✅ 버전 ${versionIndex + 1}로 전환되었습니다.`);
  showVersionHistory.value = false;
};

// 시간 포맷
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 리사이즈 시작
const startResize = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  isResizing.value = true;
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';

  const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isResizing.value) return;

    const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
    const newWidth = window.innerWidth - clientX;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      panelWidth.value = newWidth;
    }
  };

  const handleMouseUp = () => {
    isResizing.value = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchmove', handleMouseMove);
  document.addEventListener('touchend', handleMouseUp);
};
</script>

<style scoped>
.artifact-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  transition: width 0.05s ease-out;
}

/* 리사이즈 핸들 */
.resize-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.resize-handle:hover {
  background: rgba(2, 71, 138, 0.1);
}

.resize-handle:active {
  background: rgba(2, 71, 138, 0.2);
}

.resize-indicator {
  width: 3px;
  height: 40px;
  background: #d1d5db;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.resize-handle:hover .resize-indicator {
  background: #02478a;
  height: 60px;
}

.resize-handle:active .resize-indicator {
  background: #02478a;
  height: 80px;
}

.artifact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  background: #f9fafb;
}

/* 액션 툴바 */
.action-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Pretendard, sans-serif;
}

.action-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #02478a;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn svg {
  flex-shrink: 0;
}

.copy-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
}

.pdf-btn:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  color: #dc2626;
}

.edit-btn:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
  color: #a855f7;
}

.regenerate-btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  color: #22c55e;
}

.version-btn:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #f59e0b;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.artifact-icon {
  font-size: 20px;
}

.artifact-title {
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #02478a;
}

.close-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #6b7280;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.close-button:hover {
  color: #000000;
  background: #f3f4f6;
}

.artifact-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
}

/* 마크다운 스타일링 */
:deep(.markdown-content) {
  line-height: 1.6;
  white-space: pre-line;
}

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3),
:deep(.markdown-content h4),
:deep(.markdown-content h5),
:deep(.markdown-content h6) {
  margin: 12px 0 4px 0;
  font-weight: 700;
  line-height: 1.3;
  color: #02478a;
}

:deep(.markdown-content h1) {
  font-size: 2em !important;
  font-weight: 800 !important;
  color: #02478a !important;
  border-bottom: 3px solid #02478a !important;
  padding-bottom: 4px !important;
  margin: 16px 0 8px 0 !important;
  display: block !important;
}

:deep(.markdown-content h2) {
  font-size: 1.6em !important;
  font-weight: 700 !important;
  color: #0c4a6e !important;
  border-bottom: 2px solid #bae6fd !important;
  padding-bottom: 3px !important;
  margin: 14px 0 6px 0 !important;
  display: block !important;
}

:deep(.markdown-content h3) {
  font-size: 1.3em !important;
  font-weight: 700 !important;
  color: #1e40af !important;
  margin: 12px 0 4px 0 !important;
  display: block !important;
}

:deep(.markdown-content h4) {
  font-size: 1.15em !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin: 10px 0 3px 0 !important;
}

:deep(.markdown-content p) {
  margin: 3px 0;
}

:deep(.markdown-content strong) {
  font-weight: 700;
  color: #02478a;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 4px 0;
  padding-left: 1.2em;
}

:deep(.markdown-content ul) {
  list-style-type: none;
}

:deep(.markdown-content ul li) {
  position: relative;
  margin: 2px 0;
  padding-left: 1em;
}

:deep(.markdown-content ul li::before) {
  content: '▶';
  position: absolute;
  left: 0;
  color: #02478a;
  font-weight: bold;
}

:deep(.markdown-content ol li) {
  margin: 2px 0;
  padding-left: 0.3em;
}

:deep(.markdown-content hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
  background: linear-gradient(to right, #02478a, #e5e7eb, #02478a);
  height: 1px;
}

/* 스크롤바 스타일링 */
.artifact-content::-webkit-scrollbar {
  width: 6px;
}

.artifact-content::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.artifact-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.artifact-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 수정 모드 텍스트 영역 */
.edit-textarea {
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-family: Pretendard, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: #ffffff;
  box-sizing: border-box;
}

.edit-textarea::placeholder {
  color: #9ca3af;
}

.edit-textarea:focus {
  background: #f9fafb;
}

/* 텍스트 선택 팝오버 */
.text-selection-popover {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.popover-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Pretendard, sans-serif;
  white-space: nowrap;
}

.popover-btn:hover:not(:disabled) {
  background: #f3f4f6;
  transform: scale(1.05);
}

.popover-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.improve-btn {
  color: #02478a;
}

.improve-btn:hover:not(:disabled) {
  background: rgba(2, 71, 138, 0.1);
  border-color: #02478a;
  color: #02478a;
}

.cancel-btn {
  padding: 6px 10px;
  color: #6b7280;
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

/* 버전 히스토리 패널 */
.version-history-panel {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  max-height: 200px;
  overflow-y: auto;
  flex-shrink: 0;
}

.version-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.version-history-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #02478a;
  font-family: Pretendard, sans-serif;
}

.close-version-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-version-btn:hover {
  background: #e5e7eb;
  color: #000000;
}

.version-list {
  padding: 8px 12px;
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.version-item:hover {
  border-color: #02478a;
  background: rgba(2, 71, 138, 0.05);
}

.version-item.active {
  border-color: #02478a;
  background: rgba(2, 71, 138, 0.1);
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.version-number {
  font-size: 13px;
  font-weight: 600;
  color: #02478a;
  font-family: Pretendard, sans-serif;
}

.version-description {
  font-size: 11px;
  color: #6b7280;
}

.version-time {
  font-size: 11px;
  color: #9ca3af;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .artifact-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 100% !important;
    z-index: 1000;
  }

  .resize-handle {
    display: none;
  }

  .action-toolbar {
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 16px;
  }

  .action-btn {
    font-size: 12px;
    padding: 6px 10px;
  }

  .text-selection-popover {
    flex-direction: column;
    gap: 4px;
  }

  .popover-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
