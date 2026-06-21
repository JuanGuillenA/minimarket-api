import { Router } from 'express';
import { CatalogController } from '../controllers/catalog/Catalog.controller';

const router = Router();
const catalogController = new CatalogController();

// Rutas de inventario y catálogo
router.get('/articles', catalogController.getArticles);
router.post('/articles', catalogController.addArticle);

router.get('/sections', catalogController.getSections);
router.post('/sections', catalogController.addSection);

export default router;