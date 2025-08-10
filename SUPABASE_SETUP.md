# Supabase 설정 가이드

## 1. Supabase 대시보드 접속
1. https://supabase.com 로그인
2. 프로젝트 선택

## 2. RLS (Row Level Security) 정책 설정

### 방법 1: SQL Editor 사용 (권장)
1. Supabase 대시보드에서 SQL Editor 탭 클릭
2. `supabase/policies.sql` 파일의 내용을 복사하여 실행

### 방법 2: Table Editor에서 직접 설정
1. Table Editor > products 테이블 선택
2. RLS 탭 클릭
3. "Enable RLS" 활성화
4. "New Policy" 클릭하여 다음 정책들 추가:

#### SELECT 정책 (조회)
- Policy Name: "Public can view active products"
- Allowed operation: SELECT
- Target roles: anon, authenticated
- WITH CHECK expression: `true` 또는 `is_active = true`

#### INSERT 정책 (추가)
- Policy Name: "Anyone can insert products"
- Allowed operation: INSERT
- Target roles: anon, authenticated  
- WITH CHECK expression: `true`

#### UPDATE 정책 (수정)
- Policy Name: "Anyone can update products"
- Allowed operation: UPDATE
- Target roles: anon, authenticated
- USING expression: `true`
- WITH CHECK expression: `true`

#### DELETE 정책 (삭제)
- Policy Name: "Anyone can delete products"
- Allowed operation: DELETE
- Target roles: anon, authenticated
- USING expression: `true`

## 3. 환경 변수 확인
`.env.local` 파일에 다음 변수들이 올바르게 설정되어 있는지 확인:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4. 테이블 구조 확인
필요한 테이블들이 생성되어 있는지 확인:
- products
- shops
- places
- requests
- request_logs

테이블이 없다면 `supabase/migrations/` 폴더의 SQL 파일들을 실행

## 주의사항
⚠️ 현재 설정은 개발 환경용입니다. 프로덕션에서는:
- 인증된 사용자만 데이터를 수정할 수 있도록 정책 수정 필요
- 관리자 권한 시스템 구현 필요
- 적절한 보안 정책 적용 필요