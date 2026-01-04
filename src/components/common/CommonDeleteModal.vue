<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="$emit('cancel')">
      <div class="root-wrapper-common-delete-modal" @click.stop>
        <div class="frame-2147227194">
          <span class="delete-title">
            {{ title || '삭제하시겠습니까?' }}
          </span>
          <span class="delete-subtitle">
            {{ message || '삭제된 대화는 복구할 수 없습니다.' }}
          </span>
        </div>
        <div class="frame-2147227155">
          <div class="button-pc" @click="$emit('cancel')">
            <span class="text">
              취소
            </span>
          </div>
          <div class="button-pc-delete" @click="$emit('confirm')">
            <div class="frame-2147227341">
              <span class="text-delete">
                삭제하기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  title?: string
  message?: string
}

defineProps<Props>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001; /* 모든 요소보다 위에 표시 */
  backdrop-filter: blur(2px); /* 흐림 효과 추가 */
}

.root-wrapper-common-delete-modal {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 17px;
  border-radius: 12px;
  background-color: white;
  box-sizing: border-box;
  padding: 35px 60px;
}

.frame-2147227194 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-radius: 12px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.delete-title {
  color: black;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
}

.delete-subtitle {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: center;
}

.frame-2147227155 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 16px;
  box-sizing: border-box;
}

.button-pc {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border-radius: 12px;
  background-color: rgb(243, 244, 246);
  box-sizing: border-box;
  padding: 13px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-pc:hover {
  background-color: rgb(229, 231, 235);
}

.text {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
}

.button-pc-delete {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border-radius: 12px;
  width: 181px;
  background-color: rgb(248, 113, 113);
  box-sizing: border-box;
  padding: 13px 60px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-pc-delete:hover {
  background-color: rgb(239, 68, 68);
}

.frame-2147227341 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.text-delete {
  color: white;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
}
</style>