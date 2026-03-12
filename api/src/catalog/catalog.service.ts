import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProductSummaryDto } from './dto/product-summary.dto';
import { ProductDetailDto } from './dto/product-detail.dto';

type CatalogProductSummaryApi = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
};

type CatalogListApiResponse = {
  products: CatalogProductSummaryApi[];
  total: number;
  limit: number;
  skip: number;
};

type CatalogProductDetailApi = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
  thumbnail: string;
};

@Injectable()
export class CatalogService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('catalog.baseUrl')!;
  }

  async findAll(page = 1, limit = 12): Promise<{
    items: ProductSummaryDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const response = await firstValueFrom(
      this.httpService.get<CatalogListApiResponse>(
        `${this.baseUrl}/products?limit=${safeLimit}&skip=${skip}`,
      ),
    );

    const items = response.data.products.map(
      (product): ProductSummaryDto => ({
        id: product.id,
        title: product.title,
        price: product.price,
        rating: product.rating,
        thumbnail: product.thumbnail,
      }),
    );

    const total = response.data.total;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      items,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    };
  }

  async findById(id: number): Promise<ProductDetailDto> {
    const response = await firstValueFrom(
      this.httpService.get<CatalogProductDetailApi>(
        `${this.baseUrl}/products/${id}`,
      ),
    );

    const product = response.data;

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      images: product.images,
      thumbnail: product.thumbnail,
    };
  }
}
