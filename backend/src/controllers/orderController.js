import { asyncHandler } from '../utils/asyncHandler.js';
import { createOrder } from '../services/orderService.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.body);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order
  });
});
