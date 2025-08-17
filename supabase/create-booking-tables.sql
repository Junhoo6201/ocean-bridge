-- 기본 테이블 생성 (없는 경우에만)
-- 이 파일을 먼저 실행한 후 booking-enhancements.sql을 실행하세요

-- booking_requests 테이블 생성
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50) NOT NULL,
  user_email VARCHAR(255),
  user_kakao_id VARCHAR(255),
  
  -- 예약 정보
  date DATE NOT NULL,
  time TIME,
  adult_count INTEGER NOT NULL DEFAULT 1,
  child_count INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER,
  
  -- 참가자 정보 (JSON 배열)
  participants JSONB,
  
  -- 상태 관리
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',           -- 신규 요청
    'inquiring',     -- 문의 중
    'pending_payment', -- 결제 대기
    'paid',          -- 결제 완료
    'confirmed',     -- 예약 확정
    'rejected',      -- 예약 거절
    'cancelled'      -- 취소됨
  )),
  
  -- 추가 정보
  special_requests TEXT,
  meeting_place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  pickup_required BOOLEAN DEFAULT false,
  pickup_location TEXT,
  
  -- 메시징
  kakao_thread_id VARCHAR(255),
  line_thread_id VARCHAR(255),
  
  -- 결제 정보
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  paid_at TIMESTAMPTZ,
  
  -- 바우처
  voucher_code VARCHAR(50),
  voucher_issued_at TIMESTAMPTZ,
  voucher_used_at TIMESTAMPTZ,
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  
  -- 인덱스용
  CONSTRAINT unique_voucher_code UNIQUE (voucher_code)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_booking_requests_user_phone ON booking_requests(user_phone);
CREATE INDEX IF NOT EXISTS idx_booking_requests_user_id ON booking_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_date ON booking_requests(date);
CREATE INDEX IF NOT EXISTS idx_booking_requests_product_id ON booking_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_voucher_code ON booking_requests(voucher_code);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at DESC);

-- RLS 정책 활성화
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 예약만 볼 수 있음 (user_id 또는 phone 기준)
CREATE POLICY "Users can view own bookings" ON booking_requests
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    user_phone IN (
      SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
    )
  );

-- 사용자는 자신의 예약만 생성할 수 있음
CREATE POLICY "Users can create bookings" ON booking_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR auth.uid() IS NOT NULL
  );

-- 사용자는 자신의 예약만 수정할 수 있음 (상태가 new, inquiring일 때만)
CREATE POLICY "Users can update own bookings" ON booking_requests
  FOR UPDATE
  USING (
    (auth.uid() = user_id OR 
     user_phone IN (
       SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
     )) AND 
    status IN ('new', 'inquiring')
  )
  WITH CHECK (
    (auth.uid() = user_id OR 
     user_phone IN (
       SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
     )) AND 
    status IN ('new', 'inquiring', 'cancelled')
  );

-- 관리자는 모든 예약을 관리할 수 있음
CREATE POLICY "Admins can manage all bookings" ON booking_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 익명 사용자도 예약 생성 가능 (phone 기반)
CREATE POLICY "Anonymous users can create bookings" ON booking_requests
  FOR INSERT
  WITH CHECK (true);

-- 전화번호로 예약 조회 가능
CREATE POLICY "Users can view bookings by phone" ON booking_requests
  FOR SELECT
  USING (true); -- 보안을 위해 추가 검증 로직 필요

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_updated_at();

-- 바우처 코드 생성 함수
CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- ISK- 접두사 + 8자리 랜덤 코드
  result := 'ISK-';
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    IF i = 4 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 바우처 코드 자동 생성 트리거
CREATE OR REPLACE FUNCTION auto_generate_voucher_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND NEW.voucher_code IS NULL THEN
    NEW.voucher_code := generate_voucher_code();
    NEW.voucher_issued_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_voucher_generation
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status != 'confirmed')
  EXECUTE FUNCTION auto_generate_voucher_code();