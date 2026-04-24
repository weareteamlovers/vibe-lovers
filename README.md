# 팀사랑꾼들 · vibe-lovers

> 군대에서 탄생한 팀사랑꾼들닷컴  
> A full-stack portfolio and archive platform for music, media, letters, and creative tech.

![Monorepo](https://img.shields.io/badge/monorepo-vibe--lovers-111111)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black)
![Backend](https://img.shields.io/badge/backend-Supabase%20Edge%20Functions-3ECF8E)
![Database](https://img.shields.io/badge/database-Supabase%20Postgres-3ECF8E)
![Email](https://img.shields.io/badge/email-Resend-000000)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

`vibe-lovers`는 팀사랑꾼들의 음악, 영상, 프로젝트, 편지를 하나의 흐름으로 보여주기 위한 풀스택 포트폴리오 웹사이트입니다.

단순 소개 페이지가 아니라, 아래 요소들을 함께 담는 아카이브형 서비스로 설계되어 있습니다.

- 밴드 / 크리에이티브 팀 소개
- 트랙 및 미디어 쇼케이스
- GitHub 연동 기반 프로젝트 아카이브
- 방문자 편지 작성 기능
- 관리자 로그인 및 편지 관리
- 편지 등록 시 관리자 알림 메일 전송
- Supabase 기반 서버리스 백엔드 API
- GitHub Actions 기반 Supabase keep-alive 자동화

---

## Live

- Website: `https://www.weareteamlovers.com`
- Production API Base: `https://nchjhivxvnlzswdqvcqp.supabase.co/functions/v1/api`

---

## Current Production Architecture

```txt
User
  ↓
Vercel Frontend
  ↓
Supabase Edge Functions
  ↓
Supabase Postgres
  ↓
Resend Email Notification

GitHub Actions
  ↓
Supabase Keep Alive Ping
