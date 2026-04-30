import { asyncHandler } from '../utils/asyncHandler.js';
import { getCategories } from '../services/productService.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();

  res.json({
    success: true,
    categories
  });
});
