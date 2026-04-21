# 팀사랑꾼들 · vibe-lovers

> 군대에서 탄생한 팀사랑꾼들닷컴  
> A full-stack portfolio and archive platform for **music, media, letters, and creative tech**.

[![Monorepo](https://img.shields.io/badge/structure-monorepo-black)](#project-structure)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-000000)](#tech-stack)
[![Backend](https://img.shields.io/badge/backend-NestJS%2010-E0234E)](#tech-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL%2016-336791)](#tech-stack)
[![ORM](https://img.shields.io/badge/orm-Prisma-2D3748)](#tech-stack)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## Overview

**vibe-lovers**는 팀사랑꾼들의 음악·영상·프로젝트·편지를 하나의 흐름으로 보여주기 위한 **풀스택 포트폴리오 웹사이트**입니다.

단순 소개 페이지가 아니라, 아래 요소들을 함께 담는 아카이브형 서비스로 설계되어 있습니다.

- 밴드/크리에이티브 팀 소개
- 트랙 및 미디어 쇼케이스
- 프로젝트 아카이브
- 방문자 편지 작성 기능
- 관리자 로그인 및 편지 관리
- GitHub 연동 기반 프로젝트 표시

## Live

- Website: `https://www.weareteamlovers.com`
- API base: `https://api.weareteamlovers.com/api`

## Key Features

### Public site
- Hero section with branded intro and marquee
- Album preview section
- Media gallery / full video section
- Projects section
- Contact links section
- Letter section for anonymous or named messages

### Admin
- Admin login
- Letter inbox / management flow

### Backend capabilities
- Letter API
- Track API
- Media API
- GitHub integration
- Storage-related module structure
- Prisma + PostgreSQL persistence

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- NestJS 10
- Prisma
- PostgreSQL
- JWT Authentication
- Passport
- Helmet
- Cookie Parser

### Infrastructure / Dev
- Docker Compose
- GitHub Codespaces friendly setup
- Vercel / Render style deployment workflow

## Project Structure

```text
vibe-lovers/
├─ frontend/              # Next.js application
│  ├─ app/                # App Router pages
│  │  └─ admin/           # admin login / letters
│  ├─ components/
│  │  ├─ audio/
│  │  ├─ cursor/
│  │  ├─ layout/
│  │  ├─ sections/
│  │  └─ ui/
│  ├─ content/            # site content / fallback data
│  ├─ hooks/
│  ├─ lib/
│  └─ public/
│
├─ backend/               # NestJS API server
│  ├─ prisma/
│  └─ src/
│     ├─ admin/
│     ├─ common/
│     ├─ config/
│     ├─ database/
│     ├─ github/
│     ├─ letters/
│     ├─ media/
│     ├─ storage/
│     └─ tracks/
│
└─ docker-compose.yml     # local PostgreSQL
