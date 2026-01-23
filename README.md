# EulGPT Frontend

을지대학교 학생들을 위한 AI 챗봇 서비스의 프론트엔드입니다.

## 🚀 빠른 시작 (프론트엔드 개발자용)

백엔드 없이 프론트엔드만 개발하려면:

```bash
npm install
npm run dev
```

그리고 **http://localhost:3000** 접속!

### 로그인 방법

개발 환경에서는 **이메일 로그인**이 자동으로 활성화됩니다:

1. 로그인 페이지에서 **"이메일로 로그인"** 클릭
2. 이메일/비밀번호 입력
3. 로그인!

> 프로덕션 백엔드 API를 사용하므로 백엔드를 로컬에서 실행할 필요가 없습니다.

## 📚 전체 가이드

- **프론트엔드 독립 개발**: [`FRONTEND_DEV_GUIDE.md`](./FRONTEND_DEV_GUIDE.md)
- **프로젝트 전체 가이드**: [`../CLAUDE.md`](../CLAUDE.md)
- **디자인 시스템**: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

## 🛠️ 기술 스택

- **Vue 3** + Composition API
- **TypeScript**
- **Vite** (빌드 도구)
- **Tailwind CSS**
- **Vue Router**

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── chat/         # 채팅 UI
│   ├── login/        # 로그인/회원가입
│   ├── main/         # 랜딩 페이지
│   └── common/       # 공통 컴포넌트
├── views/            # 페이지
├── composables/      # useChat 등 상태 관리
├── services/         # API 호출
└── router/           # 라우팅
```

## 🔧 개발 명령어

```bash
npm run dev       # 개발 서버 (포트 3000)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 미리보기
```

## ⚠️ 중요 사항

### 포트 3000 사용

백엔드 CORS 설정이 **localhost:3000**만 허용합니다. 다른 포트는 CORS 에러가 발생합니다.

### 개발 환경 감지

이메일 로그인은 `import.meta.env.DEV === true`일 때만 표시됩니다.
프로덕션 빌드에서는 카카오 로그인만 표시됩니다.

## 🐛 문제 해결

### 로그인이 안 돼요

1. **CORS 에러**: 포트 3000을 사용하고 있는지 확인
2. **401 Unauthorized**: 이메일/비밀번호 확인
3. **이메일 로그인이 안 보여요**: `npm run dev`로 실행했는지 확인

자세한 문제 해결은 [`FRONTEND_DEV_GUIDE.md`](./FRONTEND_DEV_GUIDE.md)를 참고하세요.

## 🔗 링크

- **프로덕션**: https://euljigpt.com
- **백엔드 API**: https://fastapi-backend-production-2cd0.up.railway.app
- **API 문서**: https://fastapi-backend-production-2cd0.up.railway.app/docs

## 💬 도움이 필요하신가요?

- **전체 가이드**: `FRONTEND_DEV_GUIDE.md`
- **프로젝트 가이드**: `../CLAUDE.md`
- GitHub Issues 또는 팀 슬랙으로 문의하세요!
