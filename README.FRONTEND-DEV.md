# 프론트엔드 개발 가이드

EulGPT 프론트엔드 개발자를 위한 빠른 시작 가이드입니다.

## 🚀 빠른 시작

### 옵션 1: 프론트엔드만 개발 (가장 간단 - 백엔드 없이)

백엔드를 실행하지 않고 **프로덕션 API**를 사용하여 프론트엔드만 개발할 수 있습니다.

```bash
cd frontend

# 개발 모드 선택 스크립트 실행
./dev-mode.sh
# → 1번 선택: 프론트엔드만 개발

# 개발 서버 시작
npm run dev
```

**장점**:
- ✅ 백엔드/AI-RAG 실행 불필요
- ✅ 빠른 시작
- ✅ 실제 프로덕션 데이터 사용
- ✅ 데이터베이스 설정 불필요

**접속**:
- Frontend: http://localhost:3000

**테스트 계정**:
- 이메일: `admin@euljigpt.com`
- 비밀번호: `EulGPT@Admin2024!`

---

### 옵션 2: 풀스택 개발 (로컬 백엔드 포함)

백엔드를 포함한 전체 스택을 로컬에서 실행합니다.

```bash
cd frontend

# 개발 모드 선택 스크립트 실행
./dev-mode.sh
# → 2번 선택: 풀스택 개발

# 모든 서비스 시작 (루트 디렉토리에서)
cd ..
./start_servers_tmux.sh

# 또는 프론트엔드만 시작 (백엔드가 이미 실행 중인 경우)
cd frontend
npm run dev
```

**장점**:
- ✅ 백엔드 API 수정 가능
- ✅ AI-RAG 기능 수정 가능
- ✅ 완전한 로컬 개발 환경

**필요 사항**:
- PostgreSQL (Docker로 자동 시작)
- Redis (Docker로 자동 시작)
- Python 3.12+ (Backend)
- Python 3.11+ (AI-RAG)

**접속**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- AI-RAG API: http://localhost:8001/docs

---

## 📁 환경 설정 파일

프로젝트는 다음 환경 파일을 사용합니다:

### `.env.development`
기본 로컬 개발 설정 (로컬 백엔드 사용)
```bash
VITE_PORT=3000
VITE_FASTAPI_URL=/api              # Vite 프록시 → localhost:8000
VITE_GEMINI_FASTAPI_URL=/gemini-api  # Vite 프록시 → localhost:8001
```

### `.env.development.remote`
프론트엔드 전용 개발 설정 (프로덕션 API 사용)
```bash
VITE_PORT=3000
VITE_FASTAPI_URL=https://fastapi-backend-production-2cd0.up.railway.app
VITE_GEMINI_FASTAPI_URL=https://ai-rag-production.up.railway.app
```

### `.env.development.local` (자동 생성됨)
로컬 오버라이드 파일 (Git에서 무시됨)
- `dev-mode.sh` 스크립트가 자동으로 생성/삭제합니다
- 수동으로 편집하지 마세요

### 우선순위
```
.env.development.local  (최우선)
  ↓
.env.development
  ↓
.env
```

---

## 🔧 수동 모드 전환 (고급)

스크립트를 사용하지 않고 수동으로 전환하려면:

### 프론트엔드 전용 모드로 전환
```bash
cp .env.development.remote .env.development.local
npm run dev
```

### 풀스택 모드로 전환
```bash
rm .env.development.local
npm run dev
```

---

## 🐛 문제 해결

### 로그인이 안 될 때
1. 현재 모드 확인:
   ```bash
   cat .env.development.local 2>/dev/null || echo "풀스택 모드"
   ```

2. 프론트엔드 전용 모드라면:
   - 프로덕션 API가 정상인지 확인
   - 브라우저 콘솔에서 네트워크 오류 확인

3. 풀스택 모드라면:
   - 백엔드가 실행 중인지 확인: `curl http://localhost:8000/health`
   - AI-RAG가 실행 중인지 확인: `curl http://localhost:8001/health`

### "500 Internal Server Error" 발생
- 프론트엔드 전용 모드로 전환: `./dev-mode.sh` → 1번 선택
- 또는 백엔드 재시작: `cd .. && ./start_servers_tmux.sh`

### "Connection Refused" 발생
- 백엔드가 실행 중인지 확인
- 프론트엔드 전용 모드로 전환하여 프로덕션 API 사용

---

## 📚 추가 리소스

- **전체 프로젝트 가이드**: `../CLAUDE.md`
- **디자인 시스템**: `./DESIGN_SYSTEM.md`
- **API 문서**:
  - Backend: http://localhost:8000/docs (로컬)
  - AI-RAG: http://localhost:8001/docs (로컬)

---

## 💡 권장 워크플로우

### UI 개발자
```bash
./dev-mode.sh → 1번 선택
npm run dev
# 프론트엔드만 빠르게 개발
```

### 풀스택 개발자
```bash
./dev-mode.sh → 2번 선택
cd .. && ./start_servers_tmux.sh
# 전체 스택 수정 가능
```

### 긴급 수정 (백엔드 문제 시)
```bash
./dev-mode.sh → 1번 선택
npm run dev
# 프로덕션 API로 우회하여 프론트엔드 작업 계속
```

---

**문의**: euljigpt@gmail.com
