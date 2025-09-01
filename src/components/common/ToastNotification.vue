<template>
  <div v-if="visible" class="toast-wrapper">
    <div class="toast-icon">
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10.5" cy="10.5" r="10.5" fill="#DBEAFE"/>
        <path d="M10.5 7V11M10.5 15H10.51" stroke="#02478A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <span class="toast-message">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  message: string
  show: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000
})

const emit = defineEmits<{
  hide: []
}>()

const visible = ref(false)

watch(() => props.show, (newValue) => {
  if (newValue) {
    visible.value = true
    // 자동으로 사라지게 하기
    setTimeout(() => {
      visible.value = false
      emit('hide')
    }, props.duration)
  } else {
    visible.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.toast-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 10px 20px;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-icon {
  width: 21px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
}
</style>
