-- 예약 수정 요청 테이블
CREATE TABLE IF NOT EXISTS booking_modifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
  request_details TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이메일 로그 테이블
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES booking_requests(id) ON DELETE SET NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'opened')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- booking_requests 테이블에 취소 관련 필드 추가
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50) CHECK (refund_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS refund_amount INTEGER,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

-- 예약 상태 변경 이력 테이블
CREATE TABLE IF NOT EXISTS booking_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_booking_modifications_booking_id ON booking_modifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_modifications_status ON booking_modifications(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking_id ON booking_status_history(booking_id);

-- RLS 정책 설정
ALTER TABLE booking_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;

-- booking_modifications 정책
CREATE POLICY "Users can view their own modification requests" ON booking_modifications
  FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM booking_requests 
      WHERE user_id = auth.uid() OR user_phone IN (
        SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create modification requests for their bookings" ON booking_modifications
  FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM booking_requests 
      WHERE user_id = auth.uid() OR user_phone IN (
        SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all modification requests" ON booking_modifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- email_logs 정책 (관리자만 접근)
CREATE POLICY "Only admins can view email logs" ON email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (true);

-- booking_status_history 정책
CREATE POLICY "Users can view their booking history" ON booking_status_history
  FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM booking_requests 
      WHERE user_id = auth.uid() OR user_phone IN (
        SELECT user_phone FROM booking_requests WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "System can insert status history" ON booking_status_history
  FOR INSERT
  WITH CHECK (true);

-- 상태 변경시 자동으로 이력 기록하는 트리거
CREATE OR REPLACE FUNCTION record_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_status_history (
      booking_id,
      previous_status,
      new_status,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      CASE 
        WHEN NEW.status = 'cancelled' THEN NEW.cancellation_reason
        ELSE NULL
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_status_change_trigger
  AFTER UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION record_booking_status_change();

-- 예약 수정시 updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_modifications_updated_at
  BEFORE UPDATE ON booking_modifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();