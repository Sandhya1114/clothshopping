import { asyncHandler } from '../utils/asyncHandler.js';
import { getCurrentUser, loginUser, signupUser } from '../services/authService.js';

export const signup = asyncHandler(async (req, res) => {
  const authData = await signupUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    ...authData
  });
});

export const login = asyncHandler(async (req, res) => {
  const authData = await loginUser(req.body);

  res.json({
    success: true,
    message: 'Logged in successfully',
    ...authData
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.userId);

  res.json({
    success: true,
    user
  });
});
