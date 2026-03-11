import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateItemDto } from './dto/update-item.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  addItem(@Req() req: AuthenticatedRequest, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Post('sync')
  async syncCart(@Req() req: AuthenticatedRequest, @Body() dto: SyncCartDto) {
    return this.cartService.syncCart(req.user.sub, dto.items);
  }

  @Patch('items/:productId')
  updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(req.user.sub, productId, dto.quantity);
  }

  @Delete('items/:productId')
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(req.user.sub, productId);
  }

  @Delete()
  clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.sub);
  }
}
