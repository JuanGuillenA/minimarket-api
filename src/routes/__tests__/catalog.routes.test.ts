import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { CatalogService } from '../../services/catalog/Catalog.service';

describe('Catalog Routes & Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/catalog/articles - deberia obtener el catalogo y retornar status 200', async () => {
    const mockData = [{ _id: '1', name: 'Queso', retailPrice: 2.5 }];

    jest
      .spyOn(CatalogService.prototype, 'getInventoryList')
      .mockResolvedValue(mockData as any);

    const response = await request(app).get('/api/v1/catalog/articles');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  it('POST /api/v1/catalog/articles - deberia crear un articulo y retornar status 201 o 200', async () => {
    const newArticle = { barcode: '123', name: 'Huevos', retailPrice: 3 };

    jest
      .spyOn(CatalogService.prototype, 'createNewArticle')
      .mockResolvedValue({ _id: '3', ...newArticle } as any);

    const response = await request(app)
      .post('/api/v1/catalog/articles')
      .send(newArticle);

    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('success', true);
  });
});
