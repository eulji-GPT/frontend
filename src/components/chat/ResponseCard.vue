<template>
  <div
    class="response-card"
    :class="[`response-card-${type}`, { 'has-title': title }]"
    role="note"
    :aria-label="ariaLabel"
  >
    <div class="response-card-header">
      <div class="response-card-icon" v-html="iconSvg" aria-hidden="true"></div>
      <span v-if="title" class="response-card-title">{{ title }}</span>
      <span v-else class="response-card-type-label">{{ typeLabel }}</span>
    </div>
    <div class="response-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type CardType = 'info' | 'warning' | 'tip' | 'code' | 'quote';

const props = defineProps<{
  type: CardType;
  title?: string;
}>();

const icons: Record<CardType, string> = {
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>',
};

const typeLabels: Record<CardType, string> = {
  info: '참고',
  warning: '주의',
  tip: '팁',
  code: '코드',
  quote: '인용',
};

const iconSvg = computed(() => icons[props.type] || icons.info);
const typeLabel = computed(() => typeLabels[props.type] || typeLabels.info);
const ariaLabel = computed(() => {
  const label = props.title || typeLabel.value;
  return `${label} 카드`;
});
</script>

<style scoped>
.response-card {
  border-radius: 12px;
  margin: 12px 0;
  padding: 16px;
  border-left: 4px solid;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.response-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.response-card-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.response-card-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.response-card-title {
  font-weight: 600;
  font-size: 14px;
}

.response-card-type-label {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.response-card-content {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.response-card-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Info Card - Blue */
.response-card-info {
  border-color: #02478A;
  background: #F0F6FF;
}

.response-card-info .response-card-icon,
.response-card-info .response-card-title,
.response-card-info .response-card-type-label {
  color: #02478A;
}

/* Warning Card - Yellow/Orange */
.response-card-warning {
  border-color: #d97706;
  background: #fffbeb;
}

.response-card-warning .response-card-icon,
.response-card-warning .response-card-title,
.response-card-warning .response-card-type-label {
  color: #d97706;
}

/* Tip Card - Green */
.response-card-tip {
  border-color: #059669;
  background: #ecfdf5;
}

.response-card-tip .response-card-icon,
.response-card-tip .response-card-title,
.response-card-tip .response-card-type-label {
  color: #059669;
}

/* Code Card - Purple */
.response-card-code {
  border-color: #7c3aed;
  background: #f5f3ff;
}

.response-card-code .response-card-icon,
.response-card-code .response-card-title,
.response-card-code .response-card-type-label {
  color: #7c3aed;
}

/* Quote Card - Gray */
.response-card-quote {
  border-color: #6b7280;
  background: #f9fafb;
}

.response-card-quote .response-card-icon,
.response-card-quote .response-card-title,
.response-card-quote .response-card-type-label {
  color: #6b7280;
}

/* Hover effect */
.response-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .response-card {
    padding: 12px;
    margin: 8px 0;
  }

  .response-card-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
