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
  BadRequestException
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateItemDto } from './dto/update-item.dto';
import { SyncCartDto } from './dto/sync-cart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {

  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  addItem(
    @Req() req,
    @Body() dto: AddItemDto
  ) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Post('sync')
  async syncCart(
    @Req() req,
    @Body() dto: SyncCartDto
  ) {
    return this.cartService.syncCart(req.user.sub, dto.items)
  }

  @Patch('items/:productId')
  updateItem(
    @Req() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateItemDto
  ) {
    return this.cartService.updateItem(
      req.user.sub,
      productId,
      dto.quantity
    );
  }

  @Delete('items/:productId')
  removeItem(
    @Req() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return this.cartService.removeItem(
      req.user.sub,
      productId
    );
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.sub);
  }

}