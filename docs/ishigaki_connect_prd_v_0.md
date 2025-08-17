# Ishigaki Connect – PRD v0.1 (ko)

> 한국 여행자와 이시가키/야에야마 현지 샵·투어를 언어/예약 장벽 없이 연결하는 **초(超)로컬 액티비티 브릿지**

---

## 0) 문서 정보

- 버전: v0.1 (초안)
- 작성일: 2025-08-09 (KST)
- 작성자: 프로젝트 오너(학생, 국제고 2학년, 다이빙 Master)
- 리뷰어: 부모님(운영/법률 검토), 현지 제휴 여행사 1곳, 샵 3–5곳

---

## 1) 배경 & 문제 정의

- 이시가키/야에야마는 **바다·생물 다양성**이 탁월하지만, 현지 예약/CS는 **일본어 중심**.
- 한국 여행자는 **언어/정책/픽업·집합 정보 부족**으로 예약·변경·환불에 불편.
- 기상 변수(태풍/풍랑)에 따른 **취소/대체 루트 표준화**가 미흡.
- 대형 OTA에 상품은 있으나, **한국어 깊이·실시간 소통**·현지 디테일이 부족.

**기회**: 한국어 중심의 **설명/문의/결제/알림**을 표준화하고, 현지 샵·여행사와 **운영 프로토콜**을 수립하면 높은 만족/전환을 기대.

---

## 2) 제품 목표 (Objectives)

1. 한국어만으로 이시가키/이리오모테 **액티비티 예약** 가능하게 한다.
2. **기상 취소/대체 정책**을 명확히 고지하고 자동 안내한다.
3. **카카오톡 ↔ LINE** 양방향 메시징으로 실시간 응답(5분 이내)을 달성한다.
4. 학생 창업/프로젝트로서 **시민과학(산호/어류 관찰)** 기능을 베타 제공한다.

### 핵심 지표 (KPI)

- 전환: 방문→문의 ≥ 10%, 문의→예약 확정 ≥ 40%
- CS: 평균 1차 응답 < 5분, NPS ≥ 60, 분쟁율 < 2%
- 운영: 기상 취소 케이스의 **대체 제안률 100%**, 환불 SLA 준수 95%+
- 시민과학: 분기별 관찰 로그 100건(초기 목표)

---

## 3) 타깃 사용자 & 페르소나

- **P1 초행 가족 여행자**: 픽업/안전/환불이 최우선. 쉬운 한국어 설명, 확실한 일정 안내 필요.
- **P2 다이버(초·중·상급, 동행 가족 포함)**: 포인트·가시거리·수온·장비·보험·버디/보트 옵션 중요.
- **P3 커플/친구 여행자**: 사진 스팟, 별관측, 카비라만 글라스보트, SUP/카약 관심.

**1차 타깃**: P1, P2 (가족+다이버 동행 수요)

---

## 4) 가치 제안 (UVP)

- 일본어 몰라도 **예약금 결제→확정→바우처→전날 리마인드**까지 한국어로 끝.
- **기상 변수** 표준 운영(대체 항/대체 일정/환불 규정 즉시 안내).
- **카카오 상담**과 **LINE 현지 회신** 브릿지로 실시간.
- (차별화) **다이빙 로그/해양보전 시민과학** 참여 경험 제공.

---

## 5) 범위 (Scope)

### In (MVP)

- 한글 상품 카탈로그(다이빙/스노클/SUP·카약/별관측/글라스보트/이리오모테 일일)
- 날짜/인원 문의 → 예약요청 → 예약금 결제(국내 PG/카드) → 제휴 여행사 확정
- 카카오(고객) ↔ LINE(샵) 양방향 메시징 브릿지
- 기상/페리 취소 공지 및 **대체 루트/일정** 안내 템플릿
- 픽업/집합 **지도·사진·간판 일본어 병기**
- 번역 파이프라인(한↔일 자동 + 운영자 감수)
- 시민과학 베타: 다이빙 로그에 **종/백화/수온/가시거리** 기록
- **Places Lite**: 집합 장소 지도/사진 + 근처 ‘빠른 한 끼’ 3곳(한국인 추천/구글 평점 기반) + 교통 **링크아웃**(공식 페이지)

### Out (MVP)

- 항공/숙박 직접 판매(링크아웃만)
- 전 샵의 **실시간 재고 동기화**(초기엔 운영자 확인)
- 일본 내 여행업 직접 등록(초기엔 **등록 여행사 명의**로 확정/정산)

---

## 6) 사용자 여정 (Core Journey)

1. 랜딩→카테고리→상품 상세 열람→FAQ/정책 확인→날짜/인원 선택→**예약요청**
2. 카카오 자동 스레드 생성(고객) ⇄ 운영자 → LINE 템플릿 발송(샵)
3. 샵 회신(가능/불가/대안) → 고객에게 요약 전달
4. 가능 시 **예약금 결제 링크** 전송 → 결제 확인 → 제휴 여행사 **확정/바우처** 발송
5. 전날 **리마인드**(픽업 시간·집합 위치·준비물·기상 공지)
6. 이용 후 후기/다이빙 로그(선택) 기록

---

## 7) 기능 요구사항 (Requirements)

### F1. 상품 카탈로그/상세 (P0)

- 카테고리, 소요시간, 난이도, 연령 제한, 포함/불포함, 픽업/집합, 준비물, 보험, **취소/우천·태풍 정책** 필드화
- **수용 기준**: 관리자가 생성/수정 가능, 다국어 필드(ko/ja) 저장, 상세 내 지도/사진 첨부

### F2. 예약요청 폼 & 스레드 생성 (P0)

- 입력: 날짜, 인원, 이름, 연락처, 특이사항(예: 어린이/노약자), 동의 체크(약관/개인정보)
- 제출 시: 고객 카카오 채널에 자동 스레드 개설, 운영자 대시보드에 생성
- **수용 기준**: 폼 오류 검증, 제출 성공/실패 안내, 중복 생성 방지

### F3. 카카오 ↔ LINE 브릿지 (P0)

- 운영자가 대시보드에서 ‘현지 문의 전송’ 클릭 → LINE 템플릿(가능/불가/대안 버튼) 발송
- 샵이 버튼 선택/메시지 작성 → 웹훅 수신 → 고객 카카오 스레드로 요약 전달
- **수용 기준**: 왕복 < 10초 표준, 실패 시 재시도/수동 복구

### F4. 결제(예약금) & 확정 (P0)

- 국내 PG/카드로 예약금 결제 링크 발송(토스/카카오페이/일반 카드 중 택1)
- 결제 완료 → 제휴 여행사에 **확정 요청** 웹훅 → 바우처(메일/카카오)
- **수용 기준**: 결제 성공/취소/환불 이벤트 상태 동기화, 영수증 저장

### F5. 리마인드 & 알림 (P0)

- 전날 18:00(KST) 자동 발송: 픽업 시간, 집합 장소 지도/사진, 준비물, 기상 공지
- **수용 기준**: 타임존 처리, 메시지 미수신 재전송 로직

### F6. 기상/페리 취소 표준 운영 (P0)

- 관리자 토글: ‘Uehara 항로 취소’ 등 상태 → 관련 상품 자동 **대체 루트** 안내 템플릿 발송
- **수용 기준**: 상태 변경 후 5분 내 전 고객 알림, 대체/환불 선택 수집

### F7. 후기 & Q&A (P1)

- 이용 후 별점/후기, 자주 묻는 질문 섹션
- **수용 기준**: 악의적 후기 리포트/숨김, 이미지 첨부

### F8. 시민과학 다이빙 로그 (P1)

- 필드: 날짜, 포인트, 가시거리, 최대수심, 바닥시간, 수온, **백화 정도**, 관찰 종(태그), 사진
- **수용 기준**: CSV 내보내기, 공개/비공개 선택, 관리자가 큐레이션 가능

### F9. 운영자 대시보드 (P0)

- 요청/스레드/결제/확정/바우처/알림 현황 보드
- **수용 기준**: 상태 필터, 검색, 내보내기, 실패 이벤트 재처리(재전송)

### F10. 번역 파이프라인 (P0)

- 상품 필드 ko/ja 저장, 자동번역 초안 + **용어집** 기반 보정, ‘검수 완료’ 플래그
- **수용 기준**: 번역 이력 추적, 미검수 시 게시 금지 옵션

### F11. Places Lite (P0)

- **목표**: 핵심 현장 편의만 제공(오버스코프 방지). 상품별 집합 장소 1곳 + 근처 ‘빠른 한 끼’ 3곳 + 공식 교통 링크.
- **데이터 소스**: 한국인 다수 추천(네이버 블로그/카페 상위 언급) + Google 평점(예: ★4.2↑) 혼합 기준. 출처 메타 저장.
- **필드**: 이름(한/일), 카테고리(meeting/food/transport), 좌표, 주소(JA), 영업시간, 한글 한줄 설명, 지도 딥링크(Google/Apple), Google 평점, 출처 태그, 마지막 검수일.
- **UI**: 상품상세 하단 ‘집합 장소’ 카드 + ‘근처 빠른 한 끼(3)’ 리스트(지도 버튼) + ‘교통 안내(공식 링크)’ 버튼.
- **운영**: 분기 1회 검수 + 사용자 신고 접수 시 72h 내 반영.
- **수용 기준**: 링크 오류율 <1%, 좌표 오차 <30m, 폐점/이전 신고 처리 72h 내.

---

## 8) 정책/법무/규제

- **역할 정의**: 플랫폼은 ‘정보 제공/통역·번역/컨시어지’. 유상 **계약·정산은 등록 여행사** 명의로 수행(초기 단계).
- 약관: 취소/환불, 기상 리스크, 면책(현지 사업자 책임 범위), 개인정보처리방침(KR/EU/JPN 기본 준수)
- 문서 보관: 결제 영수증, 동의서, 알림 로그(법정 보관기간 가이드 준수)

---

## 9) 콘텐츠·현지화 가이드

- **픽업/집합**: 지도+거리 사진+간판 일본어 표기 병기
- **취소/대체 템플릿**: 태풍/풍랑/페리 항로 취소 시 문안 3종(대체항/대체일/환불)
- **용어집(샘플)**:
  - 산호 백화(bleaching) / 가시거리(visibility) / 수온(temperature)
  - 드리프트 다이빙 / 써모클라인 / 만타 / 나폴레옹피시 / 흰동가리 등
- **Places Lite 큐레이션 원칙**:
  - *한국인이 사랑하는 맛집* 중심: 네이버 블로그/카페 다중 언급 + Google 평점(예: ★4.2↑) 혼합 기준
  - ‘빠른 한 끼’ 콘셉트: 집합 장소 도보 10–15분 이내, 웨이팅/회전 고려
  - 정보 최소화: 이름(한/일)·영업시간·지도 딥링크·한 줄 설명만, 메뉴/가격 상세는 링크아웃
  - 유지보수: 분기 1회 검수, 사용자 신고 즉시 반영

---

## 10) 시스템 아키텍처 (요약)

- **프론트**: Next.js + Tailwind (i18n), Kakao 채널 위젯
- **백엔드**: Supabase(Postgres, Auth, Edge Functions)
- **메시징**: Kakao API(고객) ↔ LINE Messaging API(샵) 브릿지(Edge Function)
- **결제**: 국내 PG/카드(예약금) → 여행사 확정/정산(오프/인보이스)
- **이미지/지도**: 스토리지(S3 호환), 지도 스냅샷

---

## 11) 데이터 모델 (초안)

````sql
-- 핵심 테이블
create table shops (
  id uuid primary key default gen_random_uuid(),
  name_ko text, name_ja text,
  line_id text, phone text, email text,
  pickup_policy text, verified boolean default false,
  created_at timestamptz default now()
);

create table places (
  id uuid primary key default gen_random_uuid(),
  name_ko text, name_ja text,
  category text check (category in ('meeting','food','transport')),
  lat double precision, lng double precision,
  address_ja text,
  map_link_google text, map_link_apple text,
  hours text,
  note_ko text, note_ja text,
  photos text[],
  google_rating numeric,
  source_tags text[],
  last_verified_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table policies (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('cancel','weather')),
  ko text, ja text, last_checked_at timestamptz
);

create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id),
  title_ko text, title_ja text,
  category text, -- diving/snorkel/sup/kayak/stargazing/glassboat/iriomote
  duration_min int, difficulty text, price_from int,
  includes text, excludes text,
  meeting_point text, meeting_map_url text,
  meeting_place_id uuid references places(id), -- Places Lite 연결(선택)
  nearby_place_ids uuid[], -- 근처 맛집 등 최대 3곳
  age_limit text, insurance_note text,
  cancel_policy_id uuid references policies(id),
  weather_notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table requests (
  id uuid primary key default gen_random_uuid(),
  user_name text, user_phone text, user_kakao_id text,
  product_id uuid references products(id),
  date date, pax int, notes text,
  status text check (status in ('new','inquiring','pending_payment','paid','confirmed','rejected','cancelled')) default 'new',
  thread_id text, -- kakao thread
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  agency_ref text, deposit_amount int, currency text default 'KRW',
  payment_status text check (payment_status in ('pending','paid','refunded','cancelled')) default 'pending',
  voucher_url text, confirmed_at timestamptz
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  channel text check (channel in ('kakao','line','email')),
  sender text, text_content text, lang text, meta jsonb,
  created_at timestamptz default now()
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  code text, -- e.g., 'UEHARA_FERRY_CANCELLED'
  title_ko text, body_ko text, title_ja text, body_ja text,
  active boolean default false, updated_at timestamptz default now()
);

create table dive_logs (
  id uuid primary key default gen_random_uuid(),
  user_nickname text, spot text, date date,
  max_depth_m numeric, bottom_time_min int, temp_c numeric, visibility_m numeric,
  bleaching text check (bleaching in ('none','mild','moderate','severe')),
  species text[], photo_urls text[],
  is_public boolean default true,
  created_at timestamptz default now()
);
```sql
-- 핵심 테이블
create table shops (
  id uuid primary key default gen_random_uuid(),
  name_ko text, name_ja text,
  line_id text, phone text, email text,
  pickup_policy text, verified boolean default false,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id),
  title_ko text, title_ja text,
  category text, -- diving/snorkel/sup/kayak/stargazing/glassboat/iriomote
  duration_min int, difficulty text, price_from int,
  includes text, excludes text,
  meeting_point text, meeting_map_url text,
  age_limit text, insurance_note text,
  cancel_policy_id uuid references policies(id),
  weather_notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table requests (
  id uuid primary key default gen_random_uuid(),
  user_name text, user_phone text, user_kakao_id text,
  product_id uuid references products(id),
  date date, pax int, notes text,
  status text check (status in ('new','inquiring','pending_payment','paid','confirmed','rejected','cancelled')) default 'new',
  thread_id text, -- kakao thread
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  agency_ref text, deposit_amount int, currency text default 'KRW',
  payment_status text check (payment_status in ('pending','paid','refunded','cancelled')) default 'pending',
  voucher_url text, confirmed_at timestamptz
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  channel text check (channel in ('kakao','line','email')),
  sender text, text_content text, lang text, meta jsonb,
  created_at timestamptz default now()
);

create table policies (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('cancel','weather')),
  ko text, ja text, last_checked_at timestamptz
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  code text, -- e.g., 'UEHARA_FERRY_CANCELLED'
  title_ko text, body_ko text, title_ja text, body_ja text,
  active boolean default false, updated_at timestamptz default now()
);

create table dive_logs (
  id uuid primary key default gen_random_uuid(),
  user_nickname text, spot text, date date,
  max_depth_m numeric, bottom_time_min int, temp_c numeric, visibility_m numeric,
  bleaching text check (bleaching in ('none','mild','moderate','severe')),
  species text[], photo_urls text[],
  is_public boolean default true,
  created_at timestamptz default now()
);
````

---

## 12) API 설계 (초안)

- `GET /api/products?category=&date=`: 카탈로그/필터
- `POST /api/requests` : 예약요청 생성
- `POST /api/requests/{id}/send-to-shop` : LINE 템플릿 발송
- `POST /api/webhooks/line` : 샵 회신 수신(가능/불가/대안)
- `POST /api/payments/deposit` : 예약금 결제 링크 생성
- `POST /api/bookings/{id}/confirm` : 여행사 확정/바우처 URL 저장
- `POST /api/alerts/set` : 기상/페리 상태 토글(관리자)
- `POST /api/notifications/remind` : 전날 리마인드 발송(스케줄)

**상태 전이 규칙**

- `new → inquiring → pending_payment → paid → confirmed`
- 불가 시: `inquiring → rejected` (대안 제안 가능), `paid → cancelled/refunded`

---

## 13) 운영 & CS Runbook

- **SLA**: 영업시간 내 5분 이내 1차 응답, 최대 30분 내 확정/대안 안내
- **기상 토글**: `UEHARA_FERRY_CANCELLED=true` 시 관련 상품 고객에게 대체항(Ohara)/대체일/환불 선택지 자동 발송
- **분쟁 처리**: 로그(메시지/결제/알림) 근거로 단계별 가이드, 24h 이내 1차 판정
- **Places Lite 운영**: 폐점/이전/링크 오류 신고 폼 → 티켓 발행 → 72h 내 수정, 분기 1회 현장/전화 확인

### (신설) 현지 연락/예약 운영 모델 (v0)

**목표**: ‘빠른 확정’과 ‘안전한 커뮤니케이션’을 양립. 초기엔 **운영자 감수(Human‑in‑the‑loop)**, 점진 자동화.

**M0 수동(런칭\~W4)**

- 폼 접수 → 운영자 카카오 스레드 생성 → LINE 템플릿(가능/불가/대안) 수동 전송
- 샵 회신 **JA→KO 자동 번역 + 운영자 보정** 후 고객에게 요약 전달
- 결제 링크 수동 발송, 확정 후 바우처 수동 업로드

**M1 반자동(W5\~)**

- 대화형 **템플릿 버튼**: 샵 측 ‘可 / 不可 / 代案’ 선택 시 한국어 요약 자동 생성
- ‘빈자리候補時刻/人数/料金/送迎’ **구조화 필드**로 수집 → 고객 안내문 자동 생성
- 예약금 결제 성공 시 여행사에 **확정 요청 웹훅** 자동 발송, 바우처 자동 템플릿화

**M2 고도화(로드맵)**

- 샵별 **운영시간·휴무·満席パターン** 학습 → 자동 리마인드/리트라이
- 자주 쓰는 Q&A는 **지식베이스 번역**으로 1차 자동응답, 위험/예외(의학·안전·면책)는 **운영자 필수 검수**

**번역/용어집**

- DeepL/GPT 초안 → **용어집(ko/ja)** 강제: 픽업/集合, 乗船/搭乗, うねり/風浪, 透明度, 漂流(ドリフト) 등
- 위험/안전 문구, 취소·환불·보험은 **수동 번역 우선** (게시 전 검수 플래그 필수)

**템플릿(요지)**

- **현지 문의(JA)**: 「{日付}/{人数}/{商品}/{集合/送迎}/{料金}/{子供/高齢/注意点} 可否をご確認お願いします。返信はボタンで。」
- **고객 안내(KO)**: 가능/불가/대안 요약 + 결제 링크 + 유의/준비물 + 취소규정 발췌
- **기상/항로(JA/KO)**: 항로 취소 시 대체항/시간/환불 선택지 3버튼

**오퍼레이터 운영**

- 커버리지: KST 09–21(성수기 08–22). 2인 교대(학생+부모), 주말 피크 증원
- **품질 체크리스트**: 날짜/인원/이름(로마자)/생년월일(보험)/숙소/픽업장소/아동연령/의약·응급
- **콜다운**: 응답 지연/중요 이슈 시 샵에 전화(일본어) → 통화 메모를 스레드에 저장

**페일오버/리스크**

- LINE 장애 시 **이메일+전화** 병행. 메시지 원문/번역/시각 자동 로그화
- 태풍/대량취소: 알림 → 선택 수집 → 일괄 환불/대체 배치. 변경수수료 면제 정책 사전 고지

**컴플라이언스/정산**

- 계약/정산은 **등록 여행사** 명의. 플랫폼은 ‘정보제공/통역·번역/コンシェルジュ’ 역할 명시
- **SOP 문서화**: 예약 확정 기준, 환불 규정, 영수증/동의서 보관, 미성년자 보호

---



## 14) 분석/계측 (Instrumentation)

- 퍼널: 방문→상세→예약요청→결제→확정
- CS: 응답시간, 왕복 횟수, 대체 제안률, 환불/분쟁 사유 태깅
- 품질: 잘못된 픽업/집합 안내 리포트율, 미도착/지각률
- Places Lite: 장소 링크 클릭률(CTR), 네비게이션 성공률(유입→지도 앱 실행), 신고 건수/처리 SLA

---

## 15) 성능/보안/개인정보

- **성능**: TTFB < 200ms(캐시), 이미지 최적화, Edge Functions로 웹훅 처리
- **보안**: OAuth/JWT, RLS(Row Level Security), PII 최소 수집/암호화, 결제 토큰화
- **개인정보**: 보관 기간/파기 정책 고지, 제3자 제공(여행사/샵) 명시, 미성년자 보호 조항

---

## 16) QA 계획

- 유스케이스별 테스트 케이스(초행 가족/다이버/기상 취소)
- 카카오/LINE 웹훅 실패 재시도, 중복 결제 방지, 타임존 문제
- 다국어 검수 체크리스트(표지판/간판 표기, 의학/안전 단어)

---

## 17) 릴리스 & 로드맵

- **W1–2** 공급 계약/정책 정리(제휴 여행사 1, 샵 5–8)
- **W2–5** MVP 개발(카탈로그/요청/브릿지/결제/리마인드/기상 토글)
- **W6–8** 베타 운영(30건 문의 목표), 피드백 반영
- **W9–12** 후기/로그, 자동 바우처, 대시보드 고도화

---

## 18) 리스크 & 대응

- **법규**: 일본 여행업 규제 → 등록 여행사 명의 확정/정산, 약관 역할 명시
- **기상 대량 취소**: 대체 루트/날짜/환불 프로세스 사전 템플릿, 신속 알림
- **언어 오역**: 용어집+사람 감수, 위험 문구는 수동 번역 우선
- **공급 변동**: 정기 검수/전화 확인, 비상 연락 라인 확보

---

## 19) 부록

### A. 화면 와이어프레임(텍스트)

- **랜딩**: 히어로(“일본어 몰라도 이시가키 100%”), 카테고리 카드 6종, 후기 스니펫
- **상품상세**: 요약(Badge: 난이도/소요), 픽업/집합 지도, 포함/불포함, 취소정책, FAQ
- **예약요청**: 날짜·인원, 연락처, 특이사항, 동의 체크, 제출 성공 화면(카카오 안내)
- **마이페이지(선택)**: 내 요청/결제/바우처, 알림 내역
- **운영자 대시보드**: 요청 리스트, 상태 필터, LINE 전송, 결제/확정, 기상 토글

### B. 메시지 템플릿(요약)

- **현지 문의(샵, JA)**: {날짜/인원/상품} 가능 여부, 픽업 가능/시간, 가격 확인
- **고객 안내(KO)**: 가능/불가/대안 요약, 결제 링크, 준비물, 주의사항
- **기상 알림(KO/JA)**: 항로 취소/대체항/대체일/환불 선택

### C. 취소/대체 정책 예시

- D-3까지 무료, D-2\~D-1 50%, 당일 100%, **기상/항로 취소 전액 환불** 또는 대체

### D. 번역 용어집(샘플)

- Meeting point(집합 장소), Pick-up(픽업), Visibility(가시거리), Thermocline(써모클라인), Coral Bleaching(산호 백화), Drift(드리프트), Safety Stop(정지 감압)

### E. Places Lite Seed List (v0)

> 한국인 다중 언급(블로그/카페) + 최근 리뷰/평판을 참고한 **가벼운 추천 리스트**. 상세 평점/영업시간은 변동 가능 → 분기 검수 원칙.

**도심/이시가키 포트 주변**

- **ひとし 本店 / 石敢當店 (Hitoshi)** – 마그로(참치)·석식 인기, 예약 매우 어려움. 시그니처: 마그로/석식·이시가키규 니기리.
- **石垣島きたうち牧場 浜崎本店** – 목장 직영 야키니쿠, 가족·단체 좌석 넓음.
- **寿司海鮮 あけぼの** – 로컬이 사랑하는 노포 초밥/해산물.
- **とうふの比嘉** – 아침 전용 두부 정식(유시두부), 웨이팅 빈번.
- **VANILLA・DELI** – 이시가키규 100% 버거, 캐주얼 테이크아웃.
- **CORNER’S GRILL** – 이시가키규 버거·스테이크, 휴무 변동/예약 불가 케이스 존재.
- **うさぎや 本店** – 민요 라이브 있는 이자카야(저녁), 분위기 체험형.
- **ミルミル本舗 本店** – 언덕뷰 제라토·버거, 드라이브 코스와 궁합.

**카비라(Kabira)·북부**

- **ALOALO CAFE** – 오션뷰 카페, 커리/타코라이스, 테라스 인기.
- **Cafe Kuina** – 카비라 공원 근처 조식·브런치 가능 카페.
- **DICOPRIO Pizza Fritta** – 카비라 공원 1분, 나폴리식 ‘튀긴 피자’.

**야에야마 소바(가벼운 한 끼)**

- **来夏世(くなつゆ)** – 인기 소바 전문(도심 근교, 낮영업).
- **島そば一番地** – 도심 인기 소바, 점심 웨이팅 잦음.
- **平良商店** – 매콤 ‘카라미소 소바’ 포함, 가족 동행 무난.

> **표기 규칙**: 한글/일문 이름 병기, 좌표·주소·영업시간·지도 딥링크는 데이터 입력시 보강. ‘집합 장소 주변 10–15분 내 빠른 한 끼 3곳’은 상품별로 연결.

---

