import { getSupabaseClient } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';

function validateOrderPayload(payload) {
  const customerName = String(payload.customer_name || '').trim();
  const address = String(payload.address || '').trim();
  const phone = String(payload.phone || '').trim();
  const items = Array.isArray(payload.items) ? payload.items : [];
  const totalPrice = Number(payload.total_price);

  if (!customerName || !address || !phone) {
    throw new ApiError('Name, address, and phone are required', 400);
  }

  if (!items.length) {
    throw new ApiError('At least one cart item is required to place an order', 400);
  }

  if (Number.isNaN(totalPrice) || totalPrice <= 0) {
    throw new ApiError('A valid total price is required', 400);
  }

  return {
    customer_name: customerName,
    address,
    phone,
    items,
    total_price: Number(totalPrice.toFixed(2))
  };
}

export async function createOrder(payload) {
  const supabase = getSupabaseClient();
  const orderData = validateOrderPayload(payload);

  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select('*')
    .single();

  if (error) {
    throw new ApiError(error.message, 500);
  }

  return data;
}
