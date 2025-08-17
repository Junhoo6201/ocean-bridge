# 카카오 OAuth 로그인 설정 가이드

## 1. 카카오 개발자 설정

### 1.1 카카오 개발자센터 앱 생성
1. [카카오 개발자센터](https://developers.kakao.com) 접속
2. 내 애플리케이션 → 애플리케이션 추가하기
3. 앱 이름: "Ocean Bridge" 또는 "Ishigaki Connect"
4. 사업자명: 귀하의 사업자명 입력

### 1.2 플랫폼 설정
1. 앱 설정 → 플랫폼 → Web 플랫폼 등록
2. 사이트 도메인 추가:
   - `http://localhost:3000` (개발용)
   - `https://your-domain.com` (프로덕션)

### 1.3 카카오 로그인 활성화
1. 제품 설정 → 카카오 로그인 → 활성화 설정 ON
2. Redirect URI 설정:
   - `http://localhost:3000/auth/callback` (개발용)
   - `https://your-domain.com/auth/callback` (프로덕션)
   - Supabase 사용시: `https://cuqqiwkaapkbfzobvgve.supabase.co/auth/v1/callback`

### 1.4 동의항목 설정
1. 제품 설정 → 카카오 로그인 → 동의항목
2. 필수 동의항목:
   - 닉네임
   - 프로필 사진
3. 선택 동의항목:
   - 카카오계정(이메일)

### 1.5 앱 키 확인
1. 앱 설정 → 앱 키
2. **REST API 키** 복사 (이것을 사용합니다)

## 2. Supabase 설정

### 2.1 Supabase Dashboard 설정
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. Authentication → Providers → Kakao
3. Enable Kakao 토글 ON
4. 설정 입력:
   - **Client ID**: 카카오 REST API 키
   - **Client Secret**: (선택사항) 카카오 앱 설정에서 생성 가능
5. Save

### 2.2 Redirect URL 확인
Supabase가 제공하는 Redirect URL을 카카오 개발자센터에 등록:
- `https://cuqqiwkaapkbfzobvgve.supabase.co/auth/v1/callback`

## 3. 프로젝트 설정

### 3.1 환경변수 설정
`.env.local` 파일에 다음 추가:
```env
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_rest_api_key_here
```

### 3.2 구현된 기능
- ✅ 카카오 OAuth 로그인 함수 (`useAuth.ts`)
- ✅ OAuth 콜백 페이지 (`/pages/auth/callback.tsx`)
- ✅ 로그인 페이지 카카오 버튼 (`/pages/auth/login.tsx`)
- ✅ 세션 자동 관리
- ✅ 프로필 정보 연동

## 4. 테스트 방법

### 4.1 로컬 테스트
1. 카카오 개발자센터에서 테스트 앱 생성
2. 환경변수에 REST API 키 입력
3. `npm run dev`로 개발 서버 실행
4. http://localhost:3000/auth/login 접속
5. "카카오로 시작하기" 버튼 클릭

### 4.2 테스트 체크리스트
- [ ] 신규 사용자 카카오 로그인
- [ ] 기존 사용자 재로그인
- [ ] 프로필 정보 확인 (닉네임, 프로필 이미지)
- [ ] 로그아웃 처리
- [ ] 세션 유지 확인
- [ ] 에러 처리 (네트워크 오류, 인증 거부)

## 5. 주의사항

### 5.1 보안
- REST API 키는 클라이언트 사이드에 노출되어도 괜찮음
- Client Secret은 서버 사이드에서만 사용 (선택사항)
- HTTPS 환경에서만 프로덕션 배포

### 5.2 사용자 경험
- 첫 로그인시 동의 화면이 표시됨
- 동의 거부시 로그인 실패 처리
- 카카오 계정이 없는 사용자를 위한 이메일 로그인 옵션 제공

### 5.3 데이터 관리
- 카카오 프로필 정보는 Supabase `auth.users` 테이블의 `raw_user_meta_data`에 저장됨
- 필요시 별도 프로필 테이블 생성하여 추가 정보 관리

## 6. 트러블슈팅

### 문제: "KOE006" 에러
**해결**: Redirect URI가 카카오 개발자센터에 등록되지 않음
- 카카오 개발자센터에서 Redirect URI 추가

### 문제: "invalid_request" 에러
**해결**: Client ID가 잘못됨
- REST API 키를 정확히 복사했는지 확인

### 문제: 로그인 후 리다이렉트 안됨
**해결**: 콜백 페이지 확인
- `/pages/auth/callback.tsx` 파일이 있는지 확인
- 콘솔 에러 확인

## 7. 추가 구현 가능 기능

### 7.1 카카오 채널 연동
- 카카오톡 채널 추가하기 버튼
- 채널 메시지 발송

### 7.2 카카오페이 결제
- 카카오페이 간편결제 연동
- 정기결제 설정

### 7.3 카카오 메시지
- 카카오톡 메시지 전송
- 예약 확인 알림

## 8. 참고 링크
- [카카오 로그인 REST API 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- [Next.js OAuth 예제](https://nextjs.org/docs/app/building-your-application/authentication)