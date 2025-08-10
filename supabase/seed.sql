-- Seed data for Ishigaki Connect
-- Initial places data from JSON

-- Insert sample shops
INSERT INTO shops (name_ko, name_ja, email, phone, verified)
VALUES 
  ('이시가키 다이빙 센터', '石垣ダイビングセンター', 'info@ishigaki-diving.com', '0980-88-1234', true),
  ('블루 오션 투어', 'ブルーオーシャンツアー', 'contact@blue-ocean.jp', '0980-88-5678', true),
  ('코랄 리프 어드벤처', 'コーラルリーフアドベンチャー', 'info@coral-reef.jp', '0980-88-9012', true);

-- Insert sample policies
INSERT INTO policies (type, title_ko, title_ja, content_ko, content_ja)
VALUES 
  ('cancel', '취소 정책', 'キャンセルポリシー', 
   '투어 3일 전까지: 전액 환불\n투어 2-1일 전: 50% 환불\n투어 당일: 환불 불가\n\n※ 기상 악화로 인한 취소는 전액 환불됩니다.', 
   'ツアー3日前まで：全額返金\nツアー2-1日前：50%返金\nツアー当日：返金不可\n\n※悪天候による中止の場合は全額返金いたします。'),
  
  ('weather', '기상 정책', '気象ポリシー',
   '태풍, 높은 파도, 강풍 등 기상 악화로 투어가 취소될 경우:\n1. 대체 날짜로 변경 (우선)\n2. 다른 투어로 변경\n3. 전액 환불\n\n고객님의 안전이 최우선입니다.',
   '台風、高波、強風など悪天候によりツアーが中止となる場合：\n1. 代替日への変更（優先）\n2. 他のツアーへの変更\n3. 全額返金\n\nお客様の安全を最優先といたします。'),
   
  ('safety', '안전 수칙', '安全規則',
   '모든 참가자는:\n• 건강 상태를 정확히 알려주세요\n• 가이드의 지시를 따라주세요\n• 음주 후 참여 불가\n• 보험 가입 권장',
   'すべての参加者：\n• 健康状態を正確にお知らせください\n• ガイドの指示に従ってください\n• 飲酒後の参加不可\n• 保険加入推奨');

-- Insert places data (from the JSON file)
INSERT INTO places (
  name_ko, name_ja, category, lat, lng, address_ja, 
  map_link_google, map_link_apple, hours, note_ko, note_ja, 
  google_rating, source_tags, last_verified_at, is_active
) VALUES
  ('히토시 본점', 'ひとし 本店', 'food', 24.344444444444445, 124.15244444444444,
   '沖縄県石垣市新栄町15-8',
   'https://maps.google.com/?q=24.344444,124.152444',
   'http://maps.apple.com/?ll=24.344444,124.152444&q=%E3%81%B2%E3%81%A8%E3%81%97%20%E6%9C%AC%E5%BA%97',
   '{"mon-sun": "16:30–23:00 (L.O.22:00)", "holiday": "不定休"}',
   '참치·해산물 인기, 예약 난이도 높음', '本マグロ名物、予約困難店',
   NULL, ARRAY['tabelog', 'yahoo_travel', 'instagram'],
   '2025-08-10T00:00:00+09:00', true),
   
  ('기타우치 목장 하마사키 본점', '石垣島きたうち牧場 浜崎本店', 'food',
   24.343214, 124.153344, '沖縄県石垣市浜崎町2-3-24',
   'https://maps.google.com/?q=24.343214,124.153344',
   'http://maps.apple.com/?ll=24.343214,124.153344&q=%E7%9F%B3%E5%9E%A3%E5%B3%B6%E3%81%8D%E3%81%9F%E3%81%86%E3%81%A1%E7%89%A7%E5%A0%B4%20%E6%B5%9C%E5%B4%8E%E6%9C%AC%E5%BA%97',
   '{"lunch": "11:30–14:30", "dinner": "16:30–22:00", "lo": "21:30", "holiday": "無休"}',
   '목장 직영 야키니쿠', '牧場直営焼肉',
   NULL, ARRAY['navitime', 'official', 'gnavi'],
   '2025-08-10T00:00:00+09:00', true),
   
  ('이시가키 항 터미널', '石垣港離島ターミナル', 'meeting',
   24.3369, 124.1562, '沖縄県石垣市美崎町1',
   'https://maps.google.com/?q=24.3369,124.1562',
   'http://maps.apple.com/?ll=24.3369,124.1562',
   '{"daily": "06:00-20:00"}',
   '주요 집합 장소, 페리 터미널', '主要集合場所、フェリーターミナル',
   NULL, ARRAY['official'],
   '2025-08-10T00:00:00+09:00', true);

-- Insert sample products
WITH shop_ids AS (
  SELECT id, name_ko FROM shops
),
policy_ids AS (
  SELECT id, type FROM policies
),
place_ids AS (
  SELECT id, name_ko FROM places WHERE category = 'meeting'
)
INSERT INTO products (
  shop_id, title_ko, title_ja, description_ko, description_ja,
  category, duration_minutes, difficulty, price_adult_krw, price_child_krw,
  min_participants, max_participants,
  includes_ko, includes_ja,
  excludes_ko, excludes_ja,
  meeting_place_id, meeting_point_ko, meeting_point_ja,
  age_limit_min, age_limit_max,
  cancel_policy_id, weather_policy_id,
  preparation_ko, preparation_ja,
  is_active, display_order
)
SELECT
  (SELECT id FROM shop_ids WHERE name_ko = '이시가키 다이빙 센터'),
  '체험 다이빙 (반나절)', '体験ダイビング（半日）',
  '이시가키의 아름다운 산호초와 열대어를 만나는 첫 다이빙 체험! 초보자도 안전하게 즐길 수 있습니다.',
  '石垣島の美しいサンゴ礁と熱帯魚に出会う初めてのダイビング体験！初心者でも安全に楽しめます。',
  'diving', 180, 'beginner', 150000, 120000,
  1, 6,
  ARRAY['장비 렌탈', '가이드', '음료', '보험', '픽업 서비스'],
  ARRAY['器材レンタル', 'ガイド', 'ドリンク', '保険', '送迎サービス'],
  ARRAY['식사', '사진 촬영 (옵션)', '팁'],
  ARRAY['食事', '写真撮影（オプション）', 'チップ'],
  (SELECT id FROM place_ids LIMIT 1),
  '이시가키 항 터미널 정문', '石垣港離島ターミナル正面',
  10, 65,
  (SELECT id FROM policy_ids WHERE type = 'cancel'),
  (SELECT id FROM policy_ids WHERE type = 'weather'),
  ARRAY['수영복', '타월', '선크림', '착替'],
  ARRAY['水着', 'タオル', '日焼け止め', '着替え'],
  true, 1;

-- Grant permissions for public access
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;