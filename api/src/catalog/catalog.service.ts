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

  async findAll(): Promise<ProductSummaryDto[]> {
    const response = await firstValueFrom(
      this.httpService.get<CatalogListApiResponse>(`${this.baseUrl}/products`),
    );

    return response.data.products.map(
      (product): ProductSummaryDto => ({
        id: product.id,
        title: product.title,
        price: product.price,
        rating: product.rating,
        thumbnail: product.thumbnail,
      }),
    );
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
