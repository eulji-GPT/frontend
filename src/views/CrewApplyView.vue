<template>
  <div class="apply-page">
    <div class="background-gradient">
      <div class="ellipse animated-gradient" />
      <div class="ellipse-2 animated-gradient" />
    </div>

    <HeaderSection />

    <div class="apply-container">
      <div class="apply-header">
        <h1 class="apply-title">을GPT 지원하기</h1>
        <p class="apply-subtitle">
          을GPT와 함께 성장할 팀원을 찾습니다.<br/>
          여러분의 열정과 아이디어를 기다리고 있어요!
        </p>
      </div>

      <form class="apply-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <h2 class="section-title">기본 정보</h2>

          <div class="form-group">
            <label class="form-label">이름 <span class="required">*</span></label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">이메일 <span class="required">*</span></label>
            <input
              v-model="formData.email"
              type="email"
              class="form-input"
              placeholder="example@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">전화번호 <span class="required">*</span></label>
            <input
              v-model="formData.phone"
              type="tel"
              class="form-input"
              placeholder="010-0000-0000"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">학번 <span class="required">*</span></label>
            <input
              v-model="formData.studentId"
              type="text"
              class="form-input"
              placeholder="학번을 입력해주세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">학과 <span class="required">*</span></label>
            <input
              v-model="formData.major"
              type="text"
              class="form-input"
              placeholder="학과를 입력해주세요"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">지원 분야</h2>

          <div class="form-group">
            <label class="form-label">지원 부문 <span class="required">*</span></label>
            <select v-model="formData.department" class="form-select" required>
              <option value="">선택해주세요</option>
              <option value="frontend">Front-end</option>
              <option value="backend">Back-end</option>
              <option value="ai">AI / RAG</option>
              <option value="design">Design</option>
              <option value="parrot">Parrot</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">지원 동기 <span class="required">*</span></label>
            <textarea
              v-model="formData.motivation"
              class="form-textarea"
              placeholder="을GPT에 지원하게 된 동기를 작성해주세요"
              rows="5"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">관련 경험 및 역량</label>
            <textarea
              v-model="formData.experience"
              class="form-textarea"
              placeholder="지원 분야와 관련된 경험이나 역량을 자유롭게 작성해주세요 (선택사항)"
              rows="5"
            />
          </div>

          <div class="form-group">
            <label class="form-label">포트폴리오 / GitHub 링크</label>
            <input
              v-model="formData.portfolio"
              type="url"
              class="form-input"
              placeholder="https://"
            />
          </div>

          <div class="form-group">
            <label class="form-label">하고 싶은 말</label>
            <textarea
              v-model="formData.message"
              class="form-textarea"
              placeholder="자유롭게 작성해주세요"
              rows="4"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="goBack">취소</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? '제출 중...' : '지원하기' }}
          </button>
        </div>
      </form>
    </div>

    <FooterContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderSection from '../components/main/HeaderSection_Desktop21.vue'
import FooterContainer from '../components/crew/FooterContainer.vue'
import { getApiBaseUrl } from '@/utils/ports-config'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  studentId: '',
  major: '',
  department: '',
  motivation: '',
  experience: '',
  portfolio: '',
  message: ''
})

const isSubmitting = ref(false)

const API_BASE_URL = getApiBaseUrl()

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/crew/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '지원서 제출에 실패했습니다.')
    }

    const result = await response.json()
    console.log('지원서 제출 성공:', result)

    alert('지원서가 성공적으로 제출되었습니다!')
    router.push('/crew')
  } catch (error: any) {
    console.error('지원서 제출 실패:', error)
    alert(error.message || '지원서 제출에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/crew')
}
</script>

<style scoped>
.apply-page {
  width: 100%;
  min-height: 100vh;
  background: #141D30;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.animated-gradient {
  animation: float 6s ease-in-out infinite;
}

.ellipse {
  background: radial-gradient(circle, #4789ee 0%, #4789ee 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(150px);
  height: 600px;
  width: 600px;
  position: absolute;
  right: -300px;
  top: -300px;
  opacity: 0.4;
}

.ellipse-2 {
  background: radial-gradient(circle, #2d4a8a 0%, #2d4a8a 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(250px);
  height: 672px;
  width: 672px;
  position: absolute;
  left: -336px;
  bottom: -336px;
  opacity: 0.3;
}

.apply-container {
  max-width: 800px;
  width: 100%;
  margin: 120px auto 80px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.apply-header {
  text-align: center;
  margin-bottom: 60px;
}

.apply-title {
  font-size: 48px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.apply-subtitle {
  font-size: 18px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
}

.apply-form {
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(71, 137, 238, 0.2);
}

.form-section {
  margin-bottom: 40px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  font-size: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: #4789ee;
  margin-bottom: 24px;
  display: block;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  color: white;
  display: block;
  margin-bottom: 8px;
}

.required {
  color: #4789ee;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4789ee;
  background: rgba(255, 255, 255, 0.08);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background: #141D30;
  color: white;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary,
.btn-secondary {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4789ee, #665ced);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(71, 137, 238, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@media (max-width: 768px) {
  .apply-container {
    margin: 80px auto 40px;
    padding: 0 16px;
  }

  .apply-header {
    margin-bottom: 40px;
  }

  .apply-title {
    font-size: 32px;
  }

  .apply-subtitle {
    font-size: 16px;
    line-height: 1.6;
  }

  .apply-form {
    padding: 24px;
    border-radius: 16px;
  }

  .form-section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 15px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px 14px;
    font-size: 15px;
    border-radius: 10px;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 14px 24px;
    font-size: 15px;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .apply-container {
    margin: 70px auto 30px;
    padding: 0 12px;
  }

  .apply-header {
    margin-bottom: 30px;
  }

  .apply-title {
    font-size: 28px;
  }

  .apply-subtitle {
    font-size: 15px;
  }

  .apply-form {
    padding: 20px;
  }

  .form-section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    font-size: 14px;
    margin-bottom: 6px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 11px 12px;
    font-size: 14px;
  }

  .form-actions {
    margin-top: 24px;
    padding-top: 20px;
    gap: 10px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
