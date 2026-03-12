import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;
  let catalogService: { findAll: jest.Mock; findById: jest.Mock };

  beforeEach(() => {
    catalogService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    controller = new CatalogController(
      catalogService as unknown as CatalogService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate findAll to CatalogService', async () => {
    const expected = [
      {
        id: 1,
        title: 'Phone',
        price: 999,
        rating: 4.7,
        thumbnail: 'thumb-1.jpg',
      },
    ];
    catalogService.findAll.mockResolvedValue({
      items: expected,
      page: 2,
      limit: 8,
      total: 30,
      totalPages: 4,
    });

    const result = await controller.findAll(2, 8);

    expect(catalogService.findAll).toHaveBeenCalledWith(2, 8);
    expect(result).toEqual({
      items: expected,
      page: 2,
      limit: 8,
      total: 30,
      totalPages: 4,
    });
  });

  it('should delegate findOne to CatalogService.findById', async () => {
    const expected = {
      id: 10,
      title: 'Laptop',
      description: 'High performance',
      price: 2499,
      rating: 4.8,
      stock: 12,
      brand: 'BrandX',
      images: ['img-1.jpg'],
      thumbnail: 'thumb-10.jpg',
    };
    catalogService.findById.mockResolvedValue(expected);

    const result = await controller.findOne(10);

    expect(catalogService.findById).toHaveBeenCalledWith(10);
    expect(result).toEqual(expected);
  });
});
