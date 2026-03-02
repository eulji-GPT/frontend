<template>
  <div class="collapsible-section" :class="{ 'is-open': isOpen }">
    <button
      class="collapsible-header"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      type="button"
    >
      <span class="collapsible-icon" v-if="icon">{{ icon }}</span>
      <span class="collapsible-title">{{ title }}</span>
      <svg
        class="collapsible-arrow"
        :class="{ 'is-rotated': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
    <div
      :id="contentId"
      class="collapsible-content"
      :class="{ 'is-visible': isOpen }"
      :aria-hidden="!isOpen"
    >
      <div class="collapsible-inner" ref="innerRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  title: string;
  defaultOpen?: boolean;
  icon?: string;
}>();

const isOpen = ref(props.defaultOpen ?? false);
const innerRef = ref<HTMLElement | null>(null);

// Generate unique ID for accessibility
const contentId = computed(() => {
  return 'collapsible-' + Math.random().toString(36).substr(2, 9);
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// Expose methods for parent components
defineExpose({
  toggle,
  isOpen,
  open: () => { isOpen.value = true; },
  close: () => { isOpen.value = false; },
});
</script>

<style scoped>
.collapsible-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin: 12px 0;
  background: #ffffff;
  transition: all 0.2s ease;
}

.collapsible-section:hover {
  border-color: #d1d5db;
}

.collapsible-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
}

.collapsible-header:hover {
  background: #f3f4f6;
}

.collapsible-header:focus {
  outline: 2px solid #02478A;
  outline-offset: -2px;
}

.collapsible-header:focus:not(:focus-visible) {
  outline: none;
}

.collapsible-header:focus-visible {
  outline: 2px solid #02478A;
  outline-offset: -2px;
}

.collapsible-icon {
  font-size: 16px;
}

.collapsible-title {
  flex: 1;
}

.collapsible-arrow {
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: #6b7280;
}

.collapsible-arrow.is-rotated {
  transform: rotate(180deg);
}

.collapsible-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.collapsible-content.is-visible {
  max-height: 2000px; /* Large enough for most content */
  transition: max-height 0.5s ease-in;
}

.collapsible-inner {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

/* Dark mode support (future) */
@media (prefers-color-scheme: dark) {
  /* Reserved for dark mode styles */
}
</style>
