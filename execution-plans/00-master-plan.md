# 🌊 Ishigaki Connect - Master Execution Plan

## 프로젝트 개요
한국 여행자와 이시가키/야에야마 현지 샵·투어를 언어/예약 장벽 없이 연결하는 **초(超)로컬 액티비티 브릿지** 플랫폼

### 핵심 목표
- ✅ 한국어로 완벽한 예약 프로세스 제공
- ✅ 기상 변수 표준 운영 및 자동 대체 안내
- ✅ 카카오톡 ↔ LINE 실시간 브릿지
- ✅ 시민과학 다이빙 로그 베타 기능

### 기술 스택
- **Frontend**: Next.js 14 + TypeScript + Ocean Component System (Ishigaki Theme)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Messaging**: Kakao API + LINE Messaging API
- **Payment**: 국내 PG (토스페이먼츠/카카오페이)
- **Infrastructure**: Vercel + Supabase Cloud

## 📅 전체 개발 일정 (12주)

### Phase 1: Foundation Setup (Week 1-2)
- Supabase 프로젝트 및 데이터베이스 설정
- Next.js 프로젝트 초기화 및 Ocean Component 통합
- 인증 시스템 구축
- 다국어(ko/ja) 시스템 설정

### Phase 2: Core Booking System (Week 3-5)
- 상품 카탈로그 시스템
- 예약 요청 폼 및 프로세스
- 관리자 대시보드 기초
- 정책 관리 시스템

### Phase 3: Messaging Bridge (Week 6-7)
- Kakao Channel API 통합
- LINE Messaging API 통합
- 양방향 메시징 브릿지
- 템플릿 시스템

### Phase 4: Payment & Operations (Week 8-9)
- PG 결제 시스템 통합
- 바우처 시스템
- 기상/페리 취소 운영
- 리마인드 알림 시스템

### Phase 5: Places & Citizen Science (Week 10-11)
- Places Lite 구현
- 다이빙 로그 시스템
- 후기 시스템
- 운영 도구 고도화

### Phase 6: Launch Preparation (Week 12)
- 테스트 및 QA
- 성능 최적화
- 보안 점검
- 배포 및 모니터링 설정

## 🎯 핵심 KPI

### 전환 지표
- 방문 → 문의: ≥10%
- 문의 → 예약 확정: ≥40%

### CS 지표
- 평균 1차 응답: <5분
- NPS: ≥60
- 분쟁율: <2%

### 운영 지표
- 기상 취소 대체 제안률: 100%
- 환불 SLA 준수: 95%+

### 시민과학 지표
- 분기별 관찰 로그: 100건 (초기)

## 🔧 개발 환경 요구사항

### 필수 도구
- Node.js 18+ 
- pnpm (패키지 매니저)
- Git
- VS Code (권장)

### 계정 및 API 키
- Supabase 계정
- Vercel 계정
- Kakao Developers 계정
- LINE Developers 계정
- PG사 계정 (토스/카카오페이)

### 환경 변수
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Kakao
KAKAO_REST_API_KEY=
KAKAO_ADMIN_KEY=
KAKAO_CHANNEL_ID=

# LINE
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

# Payment
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# Others
NEXT_PUBLIC_APP_URL=
DEEPL_API_KEY=
```

## 📁 프로젝트 구조

```
ocean/
├── .claude/
│   ├── docs/                    # PRD 및 참고 문서
│   ├── execution-plans/          # 실행 계획 문서
│   └── .rules/                   # Ocean Component 규칙
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/               # Ocean Components
│   ├── lib/                      # 유틸리티 및 헬퍼
│   ├── hooks/                    # Custom React Hooks
│   ├── types/                    # TypeScript 타입 정의
│   ├── services/                 # API 서비스
│   └── styles/                   # 스타일 관련
├── supabase/
│   ├── migrations/               # DB 마이그레이션
│   └── functions/                # Edge Functions
├── public/
│   ├── images/                   # 정적 이미지
│   └── locales/                  # 번역 파일
└── tests/                        # 테스트 파일
```

## 🚀 시작하기

### 1. 프로젝트 클론 및 설정
```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 편집하여 API 키 입력

# 개발 서버 실행
pnpm dev
```

### 2. Supabase 설정
```bash
# Supabase CLI 설치 (선택사항)
npm install -g supabase

# 로컬 개발 환경 시작
supabase start

# 마이그레이션 실행
supabase db push
```

### 3. 개발 프로세스
- 각 Phase별 문서 참조
- Ocean Component Rules 준수
- 커밋 메시지 컨벤션 따르기

## 📋 체크리스트

### Phase별 진행 상태
- [ ] Phase 1: Foundation Setup
- [ ] Phase 2: Core Booking System  
- [ ] Phase 3: Messaging Bridge
- [ ] Phase 4: Payment & Operations
- [ ] Phase 5: Places & Citizen Science
- [ ] Phase 6: Launch Preparation

### 핵심 기능 구현
- [ ] 상품 카탈로그 시스템
- [ ] 예약 요청 프로세스
- [ ] 카카오 ↔ LINE 브릿지
- [ ] 결제 시스템
- [ ] 기상 취소 운영
- [ ] Places Lite
- [ ] 다이빙 로그
- [ ] 관리자 대시보드

## 📞 연락처 및 리소스

### 개발 팀
- 프로젝트 오너: [학생 개발자]
- 기술 자문: [부모님]
- 현지 협력: [제휴 여행사]

### 참고 문서
- [PRD v0.1](/Users/dev_kong/Desktop/jun_project/ocean/.claude/docs/ishigaki_connect_prd_v_0.md)
- [Ocean Component Rules](/Users/dev_kong/Desktop/jun_project/ocean/.claude/.rules/OCEAN_COMPONENT_RULES.md)
- [Places Seed Data](/Users/dev_kong/Desktop/jun_project/ocean/.claude/docs/places_seed_json_v_0_ishigaki.json)

### 외부 리소스
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Kakao Developers](https://developers.kakao.com)
- [LINE Developers](https://developers.line.biz)

## 🔄 업데이트 로그

### 2025-08-09
- Master Plan 초안 작성
- Phase별 실행 계획 구조화
- Ocean Component System 통합 계획 수립

---

**Note**: 이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다. 각 Phase별 세부 실행 계획은 별도 문서를 참조하세요.