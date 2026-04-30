import { Router } from 'express';
import { getSingleProduct, listProducts } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getSingleProduct);

export default router;
