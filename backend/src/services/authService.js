import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/token.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at
  };
}

function validateAuthPayload(payload, mode) {
  const fullName = String(payload.full_name || payload.name || '').trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (mode === 'signup' && fullName.length < 2) {
    throw new ApiError('Full name must be at least 2 characters long', 400);
  }

  if (!email || !email.includes('@')) {
    throw new ApiError('A valid email is required', 400);
  }

  if (password.length < 6) {
    throw new ApiError('Password must be at least 6 characters long', 400);
  }

  return {
    full_name: fullName,
    email,
    password
  };
}

async function findUserByEmail(email) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

  if (error) {
    throw new ApiError(error.message, 500);
  }

  return data;
}

export async function signupUser(payload) {
  const supabase = getSupabaseClient();
  const { full_name, email, password } = validateAuthPayload(payload, 'signup');
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({
      full_name,
      email,
      password_hash
    })
    .select('id, full_name, email, created_at')
    .single();

  if (error) {
    throw new ApiError(error.message, 500);
  }

  const token = signToken({
    userId: data.id,
    email: data.email
  });

  return {
    token,
    user: sanitizeUser(data)
  };
}

export async function loginUser(payload) {
  const { email, password } = validateAuthPayload(payload, 'login');
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError('Invalid email or password', 401);
  }

  const token = signToken({
    userId: user.id,
    email: user.email
  });

  return {
    token,
    user: sanitizeUser(user)
  };
}

export async function getCurrentUser(userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError('User not found', 404);
    }

    throw new ApiError(error.message, 500);
  }

  return sanitizeUser(data);
}
