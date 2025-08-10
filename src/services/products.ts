import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

export interface ProductFilters {
  category?: string[];
  difficulty?: string[];
  priceRange?: [number, number];
  duration?: number;
  isActive?: boolean;
}

// Get all products with optional filters
export async function getProducts(filters?: ProductFilters) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', filters?.isActive ?? true)
    .order('created_at', { ascending: false });

  // Apply category filter
  if (filters?.category && filters.category.length > 0) {
    query = query.in('category', filters.category);
  }

  // Apply difficulty filter  
  if (filters?.difficulty && filters.difficulty.length > 0) {
    query = query.in('difficulty', filters.difficulty);
  }

  // Apply price range filter
  if (filters?.priceRange) {
    query = query
      .gte('price_adult_krw', filters.priceRange[0])
      .lte('price_adult_krw', filters.priceRange[1]);
  }

  // Apply duration filter
  if (filters?.duration) {
    query = query.lte('duration_minutes', filters.duration);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data as Product[];
}

// Get single product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      shops (
        id,
        name_ko,
        name_ja,
        phone,
        email
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  return data as Product & { shops: any };
}

// Get popular products
export async function getPopularProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_popular', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching popular products:', error);
    throw error;
  }

  return data as Product[];
}

// Get products by category
export async function getProductsByCategory(category: string, limit = 10) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .limit(limit);

  if (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }

  return data as Product[];
}

// Search products
export async function searchProducts(searchTerm: string, locale: 'ko' | 'ja' = 'ko') {
  const titleField = locale === 'ko' ? 'title_ko' : 'title_ja';
  const descriptionField = locale === 'ko' ? 'description_ko' : 'description_ja';

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`${titleField}.ilike.%${searchTerm}%,${descriptionField}.ilike.%${searchTerm}%`);

  if (error) {
    console.error('Error searching products:', error);
    throw error;
  }

  return data as Product[];
}

// Get product count by category
export async function getProductCountByCategory() {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching product counts:', error);
    throw error;
  }

  // Count products per category
  const counts: Record<string, number> = {};
  data?.forEach(product => {
    if (product.category) {
      counts[product.category] = (counts[product.category] || 0) + 1;
    }
  });

  return counts;
}