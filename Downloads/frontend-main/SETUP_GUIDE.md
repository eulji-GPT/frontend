# EULGPT 설정 가이드

## FastAPI 백엔드와 Vue 프론트엔드 연결 설정

### 1. 백엔드 설정 (FastAPI)

#### 1.1. FastAPI 디렉토리로 이동
```bash
cd C:/github/AI-RAG/fastapi_
```

#### 1.2. 가상환경 생성 및 활성화 (권장)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 1.3. 의존성 설치
```bash
pip install -r requirements.txt
```

#### 1.4. 환경변수 설정
FastAPI 디렉토리에 `.env` 파일 생성:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### 1.5. FastAPI 서버 실행
```bash
python main.py
```
또는
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 프론트엔드 설정 (Vue)

#### 2.1. 프론트엔드 디렉토리로 이동
```bash
cd C:/github/frontend
```

#### 2.2. 의존성 설치
```bash
npm install
```

#### 2.3. 환경변수 확인
`.env` 파일이 다음과 같이 설정되어 있는지 확인:
```bash
VITE_FASTAPI_URL=http://localhost:8000
```

#### 2.4. 프론트엔드 서버 실행
```bash
npm run dev
```

### 3. 테스트

#### 3.1. 백엔드 API 테스트
브라우저에서 다음 URL 접속:
- 서버 상태: http://localhost:8000/health
- API 문서: http://localhost:8000/docs

#### 3.2. 프론트엔드 테스트
브라우저에서 다음 URL 접속:
- 메인 페이지: http://localhost:5173
- 챗봇: http://localhost:5173/chat

### 4. 문제 해결

#### 4.1. CORS 오류가 발생하는 경우
FastAPI의 `main.py`에 CORS 미들웨어가 설정되어 있는지 확인

#### 4.2. API 키 오류가 발생하는 경우
FastAPI `.env` 파일에 올바른 Gemini API 키가 설정되어 있는지 확인

#### 4.3. 포트 충돌 문제
- FastAPI: 기본 8000번 포트
- Vue: 기본 5173번 포트 (Vite)

다른 포트를 사용하려면 환경변수를 수정하세요.

### 5. 주요 변경사항

기존 Gemini API 직접 호출 방식에서 FastAPI 백엔드를 통한 호출 방식으로 변경:

- ✅ `useChat.ts`에서 FastAPI `/cot` 엔드포인트 호출
- ✅ Chain of Thought 추론 방식 지원
- ✅ 타이핑 효과로 응답 표시
- ✅ 오류 처리 개선