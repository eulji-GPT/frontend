<template>
  <div :class="['common-footer', className]">
    <div class="text-wrapper">개인정보처리방침</div>
    <p class="div">Copyright ⓒ EULGPT. All Rights Reserved</p>
    <div class="text-wrapper-2">E-mail: EULJGPT@gmail.com</div>
  </div>
</template>

<script>
export default {
  name: "CommonFooter",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.common-footer {
  align-items: center;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 120px;
  justify-content: center;
  padding: 10px 200px;
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.common-footer .text-wrapper {
  align-self: stretch;
  color: #868b97;
  font-family: 'Pretendard', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.3;
  position: relative;
}

.common-footer .div {
  align-self: stretch;
  color: #868b97;
  font-family: 'Pretendard', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
  position: relative;
}

.common-footer .text-wrapper-2 {
  align-self: stretch;
  color: #b0b4bb;
  font-family: 'Pretendard', sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.3;
  position: relative;
}
</style>
