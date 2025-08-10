-- Products 테이블 RLS 정책 설정

-- RLS 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 상품을 조회할 수 있도록 허용
CREATE POLICY "Public can view active products" ON products
  FOR SELECT
  USING (is_active = true);

-- 인증되지 않은 사용자도 모든 상품을 조회할 수 있도록 허용 (개발용)
CREATE POLICY "Anyone can view all products" ON products
  FOR SELECT
  USING (true);

-- 인증되지 않은 사용자도 상품을 추가할 수 있도록 허용 (개발용 - 나중에 제거)
CREATE POLICY "Anyone can insert products" ON products
  FOR INSERT
  WITH CHECK (true);

-- 인증되지 않은 사용자도 상품을 수정할 수 있도록 허용 (개발용 - 나중에 제거)
CREATE POLICY "Anyone can update products" ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 인증되지 않은 사용자도 상품을 삭제할 수 있도록 허용 (개발용 - 나중에 제거)
CREATE POLICY "Anyone can delete products" ON products
  FOR DELETE
  USING (true);

-- Shops 테이블 RLS 정책
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view shops" ON shops
  FOR SELECT
  USING (true);

-- Places 테이블 RLS 정책  
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view places" ON places
  FOR SELECT
  USING (true);

-- Requests 테이블 RLS 정책
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create requests" ON requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their requests" ON requests
  FOR SELECT
  USING (true);

-- Request_logs 테이블 RLS 정책
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create request logs" ON request_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view request logs" ON request_logs
  FOR SELECT
  USING (true);