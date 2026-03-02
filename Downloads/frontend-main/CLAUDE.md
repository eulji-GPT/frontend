# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EULGPT Frontend - AI chatbot service for university students built with Vue 3 + TypeScript + Vite. This is a Korean language chatbot interface that connects to multiple backend services (FastAPI for user management and Gemini FastAPI for AI chat).

## Development Commands

### Setup
```bash
npm install
cp .env.example .env  # Configure environment variables
```

### Development
```bash
npm run dev           # Start dev server on port 3000
npm run build         # Type-check with vue-tsc and build for production
npm run preview       # Preview production build
```

### Environment Variables
- `VITE_FASTAPI_URL`: Backend API URL (default: http://localhost:8000)
- `VITE_GEMINI_FASTAPI_URL`: AI chat API URL (default: http://localhost:8001)

## Architecture

### Backend Services
This frontend connects to TWO separate backend services:
1. **FastAPI Backend** (port 8000): User management, chat history, classroom reservations
2. **Gemini FastAPI** (port 8001): AI chat modes (general, CoT, RAG, study, career)

### Key Composables

**useChat.ts** - Central chat management composable with:
- Multiple chat modes: general, university, study, career, cot (Chain of Thought), rag (RAG-based search)
- Dual storage: localStorage for unauthenticated users, backend API for authenticated users
- Real-time streaming support for AI responses
- Chat session management with history persistence
- CoT (Chain of Thought) with step-by-step progress tracking
- RAG (Retrieval Augmented Generation) for university-specific information

### Authentication Flow

- Token storage: `localStorage.getItem('access_token')` (note: inconsistent with api.ts which uses 'accessToken')
- Auto-attaches Bearer token to API requests via `getAuthHeaders()`
- Auto-logout on 401 responses
- Dual authentication: Kakao OAuth and email/password

### State Management

No Vuex/Pinia - uses Vue 3 Composition API with reactive refs:
- Chat state managed in `useChat()` composable
- Local state in components for UI-specific data
- Persistent storage via localStorage + backend sync for logged-in users

### Routing Structure

- `/` - Main landing page
- `/login` - Login page
- `/signup*` - Multi-step signup flow (email → agreement → password → form → complete)
- `/chat` - Main chat interface with mode selector
- `/crew` - Team/recruitment page
- `/kakao/callback` - OAuth callback handler

### Chat Modes Implementation

Each mode calls different backend endpoints with specific request formats:
- **general**: Basic chat (`/chat` endpoint, `{message, context, session_id}`)
- **cot**: Chain of Thought with streaming steps (`/cot`, `{question, context, session_id}`)
- **rag**: University info search (`/rag/query`, `{question, prompt_type, top_k}`)
- **study**: Learning assistant (`/study`, `{question, subject, session_id}`)
- **career**: Career counseling (`/career`, `{question, major, session_id}`)

### Streaming Response Handling

- CoT mode uses Server-Sent Events (SSE) format with `data:` prefix
- Progressive rendering of step-by-step reasoning
- Real-time progress indicators with phase tracking
- Abort controllers for canceling in-flight requests
- Automatic fallback to general mode if CoT fails

### API Service Organization

**services/api.ts** contains all API calls organized by domain:
- `memberAPI`: Authentication and user management
- `chatAPI`: Chat history CRUD operations
- `classroomAPI`: Classroom reservation system
- `cafeteriaAPI`: Cafeteria congestion monitoring

### Component Structure

- `components/chat/` - Chat UI components (bubbles, input, history, mode selector)
- `components/login/` - Multi-step signup/login flow
- `components/main/` - Landing page sections
- `components/common/` - Reusable components (modals, notifications, footer)
- `components/crew/` - Recruitment/team page sections

### Proxy Configuration

Vite dev server proxies API requests:
- `/api/*` → Backend (port 8000)
- `/gemini-api/*` → AI service (port 8001)

This avoids CORS issues during development.

### TypeScript Interfaces

Key interfaces in `useChat.ts`:
- `ChatMessage`: Message structure with streaming states, CoT steps, error tracking
- `ChatSession`: Chat container with title, messages, backend sessionId
- `ChatMode`: Union type of available chat modes

## Important Patterns

### Vue Reactivity with Message Updates
Always use the `updateMessage()` helper in useChat.ts to update messages - this ensures Vue reactivity is preserved during streaming updates.

### Dual Persistence Strategy
Chat data is saved to both localStorage (immediate) and backend (for authenticated users). On load, authenticated users fetch from backend, falling back to localStorage on error.

### Error Handling
CoT mode has sophisticated error handling with user-friendly messages based on failure phase (sub_questions_error, step_critical_error, synthesis_error).

### Session Management
Each chat can have an associated backend `sessionId` for maintaining conversation context across requests.

## Korean Language Context

All user-facing text is in Korean. Error messages, UI labels, and chat responses are in Korean. Keep this in mind when adding new features or modifying text.
