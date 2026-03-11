import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cart, CartDocument } from './entities/cart.entity'
import { CatalogService } from '../catalog/catalog.service'
import { AddItemDto } from './dto/add-item.dto'

@Injectable()
export class CartService {

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly catalogService: CatalogService
  ) { }

  private formatCart(cart: CartDocument) {
    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    return {
      items: cart.items,
      total
    }
  }

  async getOrCreateCart(userId: string) {

    let cart = await this.cartModel.findOne({ userId })

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: []
      })
    }

    return cart
  }

  async getCart(userId: string) {

    const cart = await this.getOrCreateCart(userId)

    return this.formatCart(cart)
  }

  async addItem(userId: string, dto: AddItemDto) {

    const product = await this.catalogService.findById(dto.productId)

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const cart = await this.getOrCreateCart(userId)

    const existingItem = cart.items.find(
      (item) => item.productId === dto.productId
    )

    if (existingItem) {
      existingItem.quantity += dto.quantity
    } else {
      cart.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: dto.quantity
      })
    }

    await cart.save()

    return this.formatCart(cart)
  }

  async updateItem(userId: string, productId: number, quantity: number) {

    const cart = await this.getOrCreateCart(userId)

    const item = cart.items.find((i) => i.productId === productId)

    if (!item) {
      throw new NotFoundException('Item not found')
    }

    item.quantity = quantity

    await cart.save()

    return this.formatCart(cart)
  }

  async removeItem(userId: string, productId: number) {

    const cart = await this.getOrCreateCart(userId)

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    )

    await cart.save()

    return this.formatCart(cart)
  }

  async clearCart(userId: string) {

    const cart = await this.getOrCreateCart(userId)

    cart.items = []

    await cart.save()

    return {
      message: 'Cart cleared'
    }
  }


  async syncCart(userId: string, items: { productId: number; quantity: number }[]) {

    const cart = await this.getOrCreateCart(userId)

    for (const item of items) {

      const product = await this.catalogService.findById(item.productId)

      if (!product) continue

      const existingItem = cart.items.find(
        (i) => i.productId === item.productId
      )

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        cart.items.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: item.quantity
        })
      }

    }

    await cart.save()

    return this.formatCart(cart)
  }
}