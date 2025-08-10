// Database types for Ishigaki Connect

export interface Shop {
  id: string
  name_ko: string
  name_ja: string
  line_id?: string | null
  phone?: string | null
  email?: string | null
  pickup_policy?: any
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Place {
  id: string
  name_ko: string
  name_ja: string
  category: 'meeting' | 'food' | 'transport'
  lat: number
  lng: number
  address_ja?: string | null
  map_link_google?: string | null
  map_link_apple?: string | null
  hours?: any
  note_ko?: string | null
  note_ja?: string | null
  photos?: string[] | null
  google_rating?: number | null
  source_tags?: string[] | null
  last_verified_at?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Policy {
  id: string
  type: 'cancel' | 'weather' | 'refund' | 'safety'
  title_ko: string
  title_ja: string
  content_ko: string
  content_ja: string
  version?: string | null
  effective_date?: string | null
  last_checked_at?: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  shop_id?: string | null
  title_ko: string
  title_ja: string
  description_ko?: string | null
  description_ja?: string | null
  category: ProductCategory
  duration_minutes?: number | null
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
  price_adult_krw?: number | null
  price_child_krw?: number | null
  min_participants?: number
  max_participants?: number | null
  includes_ko?: string | string[] | null  // 문자열 또는 배열 허용
  includes_ja?: string | string[] | null
  excludes_ko?: string | string[] | null
  excludes_ja?: string | string[] | null
  meeting_point_id?: string | null  // 오타 수정: meeting_place_id -> meeting_point_id
  meeting_point_detail_ko?: string | null  // 필드 추가
  meeting_point_detail_ja?: string | null  // 필드 추가
  meeting_map_url?: string | null
  nearby_place_ids?: string[] | null
  age_limit_min?: number | null
  age_limit_max?: number | null
  insurance_note_ko?: string | null
  insurance_note_ja?: string | null
  cancel_policy_id?: string | null
  weather_policy_id?: string | null
  preparation_ko?: string | string[] | null
  preparation_ja?: string | string[] | null
  images?: string[] | null
  is_active: boolean
  is_popular?: boolean  // 필드 추가
  display_order?: number | null
  created_at: string
  updated_at: string
  
  // Relations
  shop?: Shop
  meeting_place?: Place
  cancel_policy?: Policy
  weather_policy?: Policy
}

export type ProductCategory = 
  | 'diving' 
  | 'snorkel' 
  | 'sup' 
  | 'kayak' 
  | 'stargazing' 
  | 'glassboat' 
  | 'iriomote'
  | 'other'

// Database schema type (for Supabase client)
export interface Database {
  public: {
    Tables: {
      shops: {
        Row: Shop
        Insert: Omit<Shop, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Shop, 'id'>>
      }
      places: {
        Row: Place
        Insert: Omit<Place, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Place, 'id'>>
      }
      policies: {
        Row: Policy
        Insert: Omit<Policy, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Policy, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'shop' | 'meeting_place' | 'cancel_policy' | 'weather_policy'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Product, 'id' | 'shop' | 'meeting_place' | 'cancel_policy' | 'weather_policy'>>
      }
    }
    Views: {}
    Functions: {
      get_nearby_places: {
        Args: {
          center_lat: number
          center_lng: number
          radius_km: number
          place_category?: string | null
        }
        Returns: {
          id: string
          name_ko: string
          name_ja: string
          category: string
          distance_km: number
          lat: number
          lng: number
          google_rating: number | null
        }[]
      }
    }
  }
}