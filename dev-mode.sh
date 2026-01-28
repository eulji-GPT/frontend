#!/bin/bash

# EulGPT 프론트엔드 개발 모드 선택 스크립트

echo "======================================"
echo "   EulGPT 프론트엔드 개발 모드 선택"
echo "======================================"
echo ""
echo "개발 모드를 선택하세요:"
echo ""
echo "1) 프론트엔드만 개발 (백엔드 없이)"
echo "   - 프로덕션 API 사용"
echo "   - 백엔드/AI-RAG 실행 불필요"
echo "   - 빠른 프론트엔드 개발"
echo ""
echo "2) 풀스택 개발 (로컬 백엔드 포함)"
echo "   - 로컬 백엔드 (port 8000) 사용"
echo "   - 로컬 AI-RAG (port 8001) 사용"
echo "   - 모든 서비스 실행 필요"
echo ""
read -p "선택 (1 또는 2): " choice

case $choice in
  1)
    echo ""
    echo "✅ 프론트엔드 전용 모드 설정 중..."
    cp .env.development.remote .env.development.local
    echo "✅ 설정 완료!"
    echo ""
    echo "📋 사용 방법:"
    echo "   npm run dev"
    echo ""
    echo "🌐 접속 URL:"
    echo "   http://localhost:3000"
    echo ""
    echo "🔑 테스트 계정:"
    echo "   이메일: admin@euljigpt.com"
    echo "   비밀번호: EulGPT@Admin2024!"
    ;;
  2)
    echo ""
    echo "✅ 풀스택 개발 모드 설정 중..."
    if [ -f .env.development.local ]; then
      rm .env.development.local
      echo "   .env.development.local 제거됨"
    fi
    echo "✅ 설정 완료!"
    echo ""
    echo "📋 사용 방법:"
    echo "   1. 먼저 모든 서비스 시작:"
    echo "      cd .. && ./start_servers_tmux.sh"
    echo "   2. 또는 프론트엔드만 시작 (백엔드가 이미 실행 중인 경우):"
    echo "      npm run dev"
    echo ""
    echo "🌐 접속 URL:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend: http://localhost:8000/docs"
    echo "   - AI-RAG: http://localhost:8001/docs"
    ;;
  *)
    echo ""
    echo "❌ 잘못된 선택입니다. 1 또는 2를 입력하세요."
    exit 1
    ;;
esac

echo ""
echo "======================================"
