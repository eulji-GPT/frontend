<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="handleClose"
        @keydown.escape="handleClose"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <div class="modal-container" ref="modalRef">
          <div class="modal-header">
            <h2 id="feedback-modal-title" class="modal-title">상세 피드백</h2>
            <button
              class="modal-close-btn"
              @click="handleClose"
              aria-label="모달 닫기"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-description">
              AI 응답에 대한 피드백을 남겨주세요. 더 나은 답변을 제공하는 데 도움이 됩니다.
            </p>

            <!-- Category Ratings -->
            <div class="feedback-categories">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-item"
              >
                <label :id="`label-${category.id}`" class="category-label">
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </label>
                <div
                  class="rating-buttons"
                  role="radiogroup"
                  :aria-labelledby="`label-${category.id}`"
                >
                  <button
                    v-for="rating in [1, 2, 3, 4, 5]"
                    :key="rating"
                    type="button"
                    class="rating-btn"
                    :class="{
                      'is-selected': feedbackData.ratings[category.id] === rating,
                      'is-positive': rating >= 4,
                      'is-neutral': rating === 3,
                      'is-negative': rating <= 2
                    }"
                    :aria-checked="feedbackData.ratings[category.id] === rating"
                    :aria-label="`${category.name} ${rating}점`"
                    role="radio"
                    @click="setRating(category.id, rating)"
                  >
                    {{ rating }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Tags -->
            <div class="feedback-tags">
              <span class="tags-label">빠른 태그 (선택사항)</span>
              <div class="tags-container">
                <button
                  v-for="tag in quickTags"
                  :key="tag.id"
                  type="button"
                  class="tag-btn"
                  :class="{ 'is-selected': feedbackData.tags.includes(tag.id) }"
                  @click="toggleTag(tag.id)"
                >
                  {{ tag.label }}
                </button>
              </div>
            </div>

            <!-- Text Feedback -->
            <div class="feedback-text">
              <label for="feedback-textarea" class="textarea-label">
                추가 의견 (선택사항)
              </label>
              <textarea
                id="feedback-textarea"
                v-model="feedbackData.comment"
                class="feedback-textarea"
                placeholder="응답에 대한 구체적인 의견을 남겨주세요..."
                rows="4"
                maxlength="500"
              ></textarea>
              <span class="char-count">{{ feedbackData.comment.length }}/500</span>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleClose"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSubmit"
              :disabled="!isValid"
            >
              피드백 제출
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

interface FeedbackCategory {
  id: string;
  name: string;
  icon: string;
}

interface QuickTag {
  id: string;
  label: string;
}

interface FeedbackData {
  ratings: Record<string, number>;
  tags: string[];
  comment: string;
}

const props = defineProps<{
  isOpen: boolean;
  messageId: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: { messageId: string; feedback: FeedbackData }): void;
  (e: 'close'): void;
}>();

const modalRef = ref<HTMLElement | null>(null);

// Feedback categories
const categories: FeedbackCategory[] = [
  { id: 'accuracy', name: '정확성', icon: '🎯' },
  { id: 'usefulness', name: '유용성', icon: '💡' },
  { id: 'completeness', name: '완성도', icon: '📋' },
  { id: 'clarity', name: '명확성', icon: '✨' },
];

// Quick feedback tags
const quickTags: QuickTag[] = [
  { id: 'too-long', label: '너무 길어요' },
  { id: 'too-short', label: '너무 짧아요' },
  { id: 'off-topic', label: '주제에서 벗어남' },
  { id: 'outdated', label: '정보가 오래됨' },
  { id: 'helpful', label: '도움이 됐어요' },
  { id: 'clear', label: '명확해요' },
];

// Feedback data
const feedbackData = reactive<FeedbackData>({
  ratings: {},
  tags: [],
  comment: '',
});

// Validation
const isValid = computed(() => {
  // At least one rating must be provided
  return Object.keys(feedbackData.ratings).length > 0;
});

// Methods
const setRating = (categoryId: string, rating: number) => {
  feedbackData.ratings[categoryId] = rating;
};

const toggleTag = (tagId: string) => {
  const index = feedbackData.tags.indexOf(tagId);
  if (index > -1) {
    feedbackData.tags.splice(index, 1);
  } else {
    feedbackData.tags.push(tagId);
  }
};

const resetForm = () => {
  feedbackData.ratings = {};
  feedbackData.tags = [];
  feedbackData.comment = '';
};

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!isValid.value) return;

  emit('submit', {
    messageId: props.messageId,
    feedback: {
      ratings: { ...feedbackData.ratings },
      tags: [...feedbackData.tags],
      comment: feedbackData.comment.trim(),
    },
  });

  resetForm();
};

// Focus trap for accessibility
const trapFocus = (e: KeyboardEvent) => {
  if (!props.isOpen || !modalRef.value) return;

  const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

// Focus management
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    // Focus first focusable element
    const firstButton = modalRef.value?.querySelector<HTMLElement>('button');
    firstButton?.focus();
    // Add focus trap
    document.addEventListener('keydown', trapFocus);
  } else {
    document.removeEventListener('keydown', trapFocus);
    resetForm();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-close-btn:focus {
  outline: 2px solid #02478A;
  outline-offset: 2px;
}

.modal-body {
  padding: 24px;
}

.modal-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* Category Ratings */
.feedback-categories {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.category-icon {
  font-size: 16px;
}

.rating-buttons {
  display: flex;
  gap: 4px;
}

.rating-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-btn:hover {
  border-color: #02478A;
  color: #02478A;
}

.rating-btn:focus {
  outline: 2px solid #02478A;
  outline-offset: 2px;
}

.rating-btn.is-selected {
  border-color: #02478A;
  background: #02478A;
  color: #ffffff;
}

.rating-btn.is-selected.is-positive {
  background: #059669;
  border-color: #059669;
}

.rating-btn.is-selected.is-neutral {
  background: #d97706;
  border-color: #d97706;
}

.rating-btn.is-selected.is-negative {
  background: #dc2626;
  border-color: #dc2626;
}

/* Quick Tags */
.feedback-tags {
  margin-bottom: 24px;
}

.tags-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: #02478A;
  color: #02478A;
}

.tag-btn:focus {
  outline: 2px solid #02478A;
  outline-offset: 2px;
}

.tag-btn.is-selected {
  border-color: #02478A;
  background: #F0F6FF;
  color: #02478A;
}

/* Text Feedback */
.feedback-text {
  position: relative;
}

.textarea-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.feedback-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.feedback-textarea:focus {
  outline: none;
  border-color: #02478A;
  box-shadow: 0 0 0 3px rgba(2, 71, 138, 0.1);
}

.feedback-textarea::placeholder {
  color: #9ca3af;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #9ca3af;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:focus {
  outline: 2px solid #02478A;
  outline-offset: 2px;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  background: #02478A;
  border: 1px solid #02478A;
  color: #ffffff;
}

.btn-primary:hover {
  background: #023d75;
}

.btn-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(-10px);
}

/* Mobile */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
    align-items: flex-end;
  }

  .modal-container {
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
  }

  .category-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .rating-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .rating-btn {
    flex: 1;
    max-width: 60px;
  }
}
</style>
