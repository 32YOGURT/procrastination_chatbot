@AGENTS.md

# 1. Project Overview

Project: 지연 행동 교정 웰니스 프로그램

Objective: 사용자의 성격 유형과 지연 행동 단계를 분석하여, 인지행동치료(CBT) 기반의 맞춤형 솔루션을 제공하는 심리 코칭 챗봇 서비스.

Target: 대학생 및 자기계발이 필요한 성인.

# 2. Tech Stack & Architecture

Frontend: Next.js (App Router), TypeScript, Tailwind CSS.

AI Orchestration: Dify (Cloud).

Backend: Next.js API Routes (Route Handlers).

Dify API Key 보안을 위해 프론트엔드가 아닌 API Route에서 서버사이드 통신 수행.

Database: 초기 단계에서는 미도입 (LocalStorage 또는 Session 기반 유저 상태 유지). 향후 Supabase 도입 가능성 있음.

Deployment: Vercel.

# 3. Core Logic & Data Structure

Categorization: [5가지 성격 유형] x [5단계 행동 단계] = 총 25가지 케이스의 상담 매트릭스.

Parameters: 프론트엔드에서 계산된 유저의 상태값(personality_type, procrastination_type 등)을 Dify API의 inputs로 전달하여 응답 개인화.

Response Format: AI 답변은 단순 텍스트가 아닌, 프론트엔드 렌더링을 위한 JSON 데이터를 포함해야 함 (상태 코드, 시각화용 수치 등).
