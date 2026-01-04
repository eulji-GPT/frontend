# EULGPT Frontend

대학생을 위한 AI 챗봇 서비스 프론트엔드

## 기술 스택
- Vue 3 + TypeScript + Vite
- Tailwind CSS
- Vue Router
- Lottie 애니메이션

## 설정 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```
VITE_FASTAPI_URL=http://localhost:8000
```

### 3. FastAPI 백엔드 실행
먼저 FastAPI 백엔드 서버가 실행되어야 합니다:

```bash
cd ../AI-RAG/fastapi_
pip install -r requirements.txt
python main.py
```

### 4. 프론트엔드 실행
```bash
npm run dev
```

## 주요 기능
- AI 챗봇과의 실시간 대화
- Chain of Thought 추론 방식 지원
- 대화 히스토리 관리
- 반응형 디자인
- 로띠 애니메이션
