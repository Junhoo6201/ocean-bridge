-- Sample Products for Testing
-- Run this after setup-all.sql

-- Get shop IDs
WITH shop_data AS (
  SELECT id, name_ko FROM shops LIMIT 3
),
place_data AS (
  SELECT id FROM places WHERE type = 'meeting_point' LIMIT 1
),
policy_data AS (
  SELECT id, type FROM policies
)

-- Insert sample products
INSERT INTO products (
  shop_id, 
  title_ko, title_ja, 
  description_ko, description_ja,
  category, difficulty, duration_minutes,
  price_adult_krw, price_child_krw,
  min_participants, max_participants,
  meeting_point_id,
  meeting_point_detail_ko, meeting_point_detail_ja,
  includes_ko, includes_ja,
  excludes_ko, excludes_ja,
  preparation_ko, preparation_ja,
  cancel_policy_id, weather_policy_id,
  is_active, is_popular
)
SELECT
  s.id,
  product.title_ko, product.title_ja,
  product.description_ko, product.description_ja,
  product.category, product.difficulty, product.duration_minutes,
  product.price_adult_krw, product.price_child_krw,
  product.min_participants, product.max_participants,
  (SELECT id FROM place_data LIMIT 1),
  product.meeting_point_detail_ko, product.meeting_point_detail_ja,
  product.includes_ko, product.includes_ja,
  product.excludes_ko, product.excludes_ja,
  product.preparation_ko, product.preparation_ja,
  (SELECT id FROM policy_data WHERE type = 'cancel' LIMIT 1),
  (SELECT id FROM policy_data WHERE type = 'weather' LIMIT 1),
  true, product.is_popular
FROM shop_data s
CROSS JOIN (
  VALUES
  -- 스노클링 투어
  (
    '카비라만 스노클링 투어', '川平湾シュノーケリングツアー',
    '이시가키 최고의 명소 카비라만에서 즐기는 스노클링! 바다거북과 열대어를 만나보세요.',
    '石垣島の絶景スポット川平湾でシュノーケリング！ウミガメと熱帯魚に会えるかも。',
    'snorkel', 'beginner', 180,
    85000, 60000, 2, 10,
    '카비라만 주차장 앞 파란색 파라솔', '川平湾駐車場前の青いパラソル',
    '["스노클링 장비", "라이프자켓", "수중 사진", "간식 및 음료"]'::jsonb,
    '["シュノーケリング機材", "ライフジャケット", "水中写真", "軽食・飲み物"]'::jsonb,
    '["수영복", "타올", "선크림"]'::jsonb,
    '["水着", "タオル", "日焼け止め"]'::jsonb,
    '["수영복 착용", "타올 2장", "선크림", "멀미약(필요시)"]'::jsonb,
    '["水着着用", "タオル2枚", "日焼け止め", "酔い止め(必要な方)"]'::jsonb,
    true
  ),
  -- 다이빙 투어
  (
    '맨타 다이빙 체험', 'マンタダイビング体験',
    '세계적으로 유명한 이시가키의 맨타 포인트에서 다이빙! 거대한 맨타를 가까이서 관찰하세요.',
    '世界的に有名な石垣島のマンタポイントでダイビング！巨大なマンタを間近で観察。',
    'diving', 'advanced', 360,
    250000, null, 2, 8,
    '이시가키 항구 다이빙샵 앞', '石垣港ダイビングショップ前',
    '["다이빙 장비 풀세트", "보트 이동", "점심 도시락", "음료"]'::jsonb,
    '["ダイビング機材フルセット", "ボート移動", "昼食弁当", "飲み物"]'::jsonb,
    '["다이빙 라이센스", "개인 장비"]'::jsonb,
    '["ダイビングライセンス", "個人装備"]'::jsonb,
    '["다이빙 라이센스", "로그북", "수영복", "타올"]'::jsonb,
    '["ダイビングライセンス", "ログブック", "水着", "タオル"]'::jsonb,
    true
  ),
  -- SUP 요가
  (
    'SUP 요가 체험', 'SUPヨガ体験',
    '잔잔한 바다 위에서 즐기는 SUP 요가. 초보자도 쉽게 참여할 수 있습니다.',
    '穏やかな海の上で楽しむSUPヨガ。初心者でも簡単に参加できます。',
    'sup', 'beginner', 90,
    65000, 45000, 2, 8,
    '카비라만 비치 입구', '川平湾ビーチ入口',
    '["SUP 보드", "패들", "라이프자켓", "요가 매트"]'::jsonb,
    '["SUPボード", "パドル", "ライフジャケット", "ヨガマット"]'::jsonb,
    '["수영복", "타올", "음료"]'::jsonb,
    '["水着", "タオル", "飲み物"]'::jsonb,
    '["수영복", "타올", "선크림", "물"]'::jsonb,
    '["水着", "タオル", "日焼け止め", "水"]'::jsonb,
    false
  )
) AS product(
  title_ko, title_ja,
  description_ko, description_ja,
  category, difficulty, duration_minutes,
  price_adult_krw, price_child_krw,
  min_participants, max_participants,
  meeting_point_detail_ko, meeting_point_detail_ja,
  includes_ko, includes_ja,
  excludes_ko, excludes_ja,
  preparation_ko, preparation_ja,
  is_popular
)
WHERE s.name_ko = '오션 다이브 센터'
LIMIT 1;