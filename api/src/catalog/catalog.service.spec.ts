import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpService: { get: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('https://api.example.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and map product summaries in findAll', async () => {
    httpService.get.mockReturnValue(
      of({
        data: {
          products: [
            {
              id: 1,
              title: 'Phone',
              price: 999,
              rating: 4.7,
              thumbnail: 'thumb-1.jpg',
            },
            {
              id: 2,
              title: 'Headphones',
              price: 199,
              rating: 4.2,
              thumbnail: 'thumb-2.jpg',
            },
          ],
        },
      }),
    );

    const result = await service.findAll();

    expect(httpService.get).toHaveBeenCalledWith('https://api.example.com/products');
    expect(result).toEqual([
      {
        id: 1,
        title: 'Phone',
        price: 999,
        rating: 4.7,
        thumbnail: 'thumb-1.jpg',
      },
      {
        id: 2,
        title: 'Headphones',
        price: 199,
        rating: 4.2,
        thumbnail: 'thumb-2.jpg',
      },
    ]);
  });

  it('should fetch and map product detail in findById', async () => {
    httpService.get.mockReturnValue(
      of({
        data: {
          id: 10,
          title: 'Laptop',
          description: 'High performance',
          price: 2499,
          rating: 4.8,
          stock: 12,
          brand: 'BrandX',
          images: ['img-1.jpg', 'img-2.jpg'],
          thumbnail: 'thumb-10.jpg',
        },
      }),
    );

    const result = await service.findById(10);

    expect(httpService.get).toHaveBeenCalledWith('https://api.example.com/products/10');
    expect(result).toEqual({
      id: 10,
      title: 'Laptop',
      description: 'High performance',
      price: 2499,
      rating: 4.8,
      stock: 12,
      brand: 'BrandX',
      images: ['img-1.jpg', 'img-2.jpg'],
      thumbnail: 'thumb-10.jpg',
    });
  });
});
