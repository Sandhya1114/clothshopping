import { asyncHandler } from '../utils/asyncHandler.js';
import { getProductById, getProducts } from '../services/productService.js';

export const listProducts = asyncHandler(async (req, res) => {
  const data = await getProducts(req.query);

  res.json({
    success: true,
    ...data
  });
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);

  res.json({
    success: true,
    product
  });
});
