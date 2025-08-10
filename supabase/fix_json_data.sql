-- 기존 문자열 데이터를 JSON 배열로 변환하는 스크립트

-- products 테이블의 includes_ko 필드 업데이트
UPDATE products
SET includes_ko = 
  CASE
    WHEN includes_ko IS NULL OR includes_ko = '' THEN '[]'
    WHEN includes_ko LIKE '[%' THEN includes_ko  -- 이미 JSON 배열인 경우
    WHEN includes_ko LIKE '%,%' THEN  -- 쉼표로 구분된 경우
      (
        SELECT json_build_array(array_to_json(string_to_array(includes_ko, ',')))::text
      )
    ELSE 
      json_build_array(includes_ko)::text  -- 단일 문자열인 경우
  END
WHERE includes_ko IS NOT NULL;

-- products 테이블의 includes_ja 필드 업데이트
UPDATE products
SET includes_ja = 
  CASE
    WHEN includes_ja IS NULL OR includes_ja = '' THEN '[]'
    WHEN includes_ja LIKE '[%' THEN includes_ja
    WHEN includes_ja LIKE '%,%' THEN 
      (
        SELECT json_build_array(array_to_json(string_to_array(includes_ja, ',')))::text
      )
    ELSE 
      json_build_array(includes_ja)::text
  END
WHERE includes_ja IS NOT NULL;

-- products 테이블의 excludes_ko 필드 업데이트
UPDATE products
SET excludes_ko = 
  CASE
    WHEN excludes_ko IS NULL OR excludes_ko = '' THEN '[]'
    WHEN excludes_ko LIKE '[%' THEN excludes_ko
    WHEN excludes_ko LIKE '%,%' THEN 
      (
        SELECT json_build_array(array_to_json(string_to_array(excludes_ko, ',')))::text
      )
    ELSE 
      json_build_array(excludes_ko)::text
  END
WHERE excludes_ko IS NOT NULL;

-- products 테이블의 excludes_ja 필드 업데이트
UPDATE products
SET excludes_ja = 
  CASE
    WHEN excludes_ja IS NULL OR excludes_ja = '' THEN '[]'
    WHEN excludes_ja LIKE '[%' THEN excludes_ja
    WHEN excludes_ja LIKE '%,%' THEN 
      (
        SELECT json_build_array(array_to_json(string_to_array(excludes_ja, ',')))::text
      )
    ELSE 
      json_build_array(excludes_ja)::text
  END
WHERE excludes_ja IS NOT NULL;

-- products 테이블의 preparation_ko 필드 업데이트
UPDATE products
SET preparation_ko = 
  CASE
    WHEN preparation_ko IS NULL OR preparation_ko = '' THEN '[]'
    WHEN preparation_ko LIKE '[%' THEN preparation_ko
    WHEN preparation_ko LIKE '%,%' THEN 
      (
        SELECT json_build_array(array_to_json(string_to_array(preparation_ko, ',')))::text
      )
    ELSE 
      json_build_array(preparation_ko)::text
  END
WHERE preparation_ko IS NOT NULL;

-- products 테이블의 preparation_ja 필드 업데이트
UPDATE products
SET preparation_ja = 
  CASE
    WHEN preparation_ja IS NULL OR preparation_ja = '' THEN '[]'
    WHEN preparation_ja LIKE '[%' THEN preparation_ja
    WHEN preparation_ja LIKE '%,%' THEN 
      (
        SELECT json_build_array(array_to_json(string_to_array(preparation_ja, ',')))::text
      )
    ELSE 
      json_build_array(preparation_ja)::text
  END
WHERE preparation_ja IS NOT NULL;

-- NULL 값들을 빈 배열로 설정
UPDATE products SET includes_ko = '[]' WHERE includes_ko IS NULL;
UPDATE products SET includes_ja = '[]' WHERE includes_ja IS NULL;
UPDATE products SET excludes_ko = '[]' WHERE excludes_ko IS NULL;
UPDATE products SET excludes_ja = '[]' WHERE excludes_ja IS NULL;
UPDATE products SET preparation_ko = '[]' WHERE preparation_ko IS NULL;
UPDATE products SET preparation_ja = '[]' WHERE preparation_ja IS NULL;