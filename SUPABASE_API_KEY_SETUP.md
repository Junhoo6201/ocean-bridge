# Supabase API Key 설정 가이드

## 🔑 API 키 확인 및 설정 방법

### 1. Supabase 대시보드에서 API 키 찾기
1. https://supabase.com 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Settings** 클릭
4. **API** 탭 선택
5. 다음 두 개의 키 확인:
   - **Project URL**: `https://xxxxx.supabase.co` 형태
   - **anon public**: `eyJhbGc...` 로 시작하는 긴 문자열

### 2. .env.local 파일 업데이트
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. API 키 문제 해결 체크리스트

#### ✅ 확인사항:
- [ ] API 키가 완전한가? (끝부분이 잘리지 않았는지)
- [ ] API 키에 공백이나 특수문자가 섞이지 않았는지
- [ ] Project URL이 정확한지 (https:// 포함)
- [ ] 개발 서버를 재시작했는지

#### 🚨 일반적인 문제:
1. **키가 잘림**: 복사할 때 전체를 선택하지 못한 경우
2. **줄바꿈 문제**: 키 중간에 줄바꿈이 들어간 경우
3. **따옴표 문제**: 키를 따옴표로 감싼 경우 (따옴표 불필요)
4. **캐시 문제**: 브라우저 캐시 또는 Next.js 캐시

### 4. RLS (Row Level Security) 설정 확인

401 에러가 계속 발생한다면 RLS 정책도 확인:

1. Supabase 대시보드 > Table Editor
2. products 테이블 선택
3. RLS 탭 확인
4. 다음 중 하나 선택:
   - **개발용**: RLS 비활성화 (Disable RLS)
   - **프로덕션용**: 적절한 정책 설정

### 5. 테스트 방법

터미널에서 직접 테스트:
```bash
curl 'https://your-project.supabase.co/rest/v1/products' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

성공하면 JSON 데이터 반환, 실패하면 에러 메시지 확인