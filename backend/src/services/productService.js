import { getSupabaseClient } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';

const baseCategories = ['men', 'women', 'kids', 'accessories'];

function normalizePagination(value, fallback) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export async function getProducts(filters = {}) {
  const supabase = getSupabaseClient();
  const page = normalizePagination(filters.page, 1);
  const limit = normalizePagination(filters.limit, 9);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (filters.search) {
    const searchTerm = String(filters.search).trim();
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', String(filters.category).toLowerCase());
  }

  if (filters.minPrice) {
    query = query.gte('price', Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    query = query.lte('price', Number(filters.maxPrice));
  }

  if (filters.size && filters.size !== 'all') {
    query = query.contains('sizes', [String(filters.size).toUpperCase()]);
  }

  if (filters.sort === 'price-high-low') {
    query = query.order('price', { ascending: false });
  } else if (filters.sort === 'price-low-high') {
    query = query.order('price', { ascending: true });
  } else {
    query = query.order('id', { ascending: true });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new ApiError(error.message, 500);
  }

  return {
    products: data || [],
    pagination: {
      page,
      limit,
      totalItems: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0
    }
  };
}

export async function getProductById(id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError('Product not found', 404);
    }

    throw new ApiError(error.message, 500);
  }

  return data;
}

export async function getCategories() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('products').select('category');

  if (error) {
    throw new ApiError(error.message, 500);
  }

  const counts = new Map(baseCategories.map((category) => [category, 0]));

  (data || []).forEach((row) => {
    const category = String(row.category || '').toLowerCase();

    if (counts.has(category)) {
      counts.set(category, counts.get(category) + 1);
    }
  });

  return baseCategories.map((category) => ({
    slug: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    count: counts.get(category) || 0
  }));
}
