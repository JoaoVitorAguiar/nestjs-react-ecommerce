import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProductSummaryDto } from './dto/product-summary.dto';
import { ProductDetailDto } from './dto/product-detail.dto';

@Injectable()
export class CatalogService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('catalog.baseUrl')!;
  }

  async findAll(): Promise<ProductSummaryDto[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/products`)
    )

    return response.data.products.map((p): ProductSummaryDto => ({
      id: p.id,
      title: p.title,
      price: p.price,
      rating: p.rating,
      thumbnail: p.thumbnail
    }))
  }

  async findById(id: number): Promise<ProductDetailDto> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/products/${id}`)
    )

    const product = response.data

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      images: product.images,
      thumbnail: product.thumbnail
    }
  }
}