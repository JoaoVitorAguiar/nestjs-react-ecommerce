import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CatalogService } from '../catalog/catalog.service';

type CartItem = {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

type CartDoc = {
  userId: string;
  items: CartItem[];
  save: jest.Mock;
};

describe('CartService', () => {
  let service: CartService;
  let cartModel: { findOne: jest.Mock; create: jest.Mock };
  let catalogService: { findById: jest.Mock };

  const createCartDoc = (userId: string, items: CartItem[] = []): CartDoc => ({
    userId,
    items,
    save: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    cartModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    catalogService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: cartModel,
        },
        {
          provide: CatalogService,
          useValue: catalogService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should create a new cart when user has no cart and return total as 0', async () => {
      cartModel.findOne.mockResolvedValue(null);
      const createdCart = createCartDoc('user-1', []);
      cartModel.create.mockResolvedValue(createdCart);

      const result = await service.getCart('user-1');

      expect(cartModel.findOne).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(cartModel.create).toHaveBeenCalledWith({
        userId: 'user-1',
        items: [],
      });
      expect(result).toEqual({ items: [], total: 0 });
    });

    it('should return existing cart with correctly calculated total', async () => {
      const existingCart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'A',
          price: 10,
          quantity: 2,
          thumbnail: 'a.jpg',
        },
        {
          productId: 2,
          title: 'B',
          price: 7.5,
          quantity: 4,
          thumbnail: 'b.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(existingCart);

      const result = await service.getCart('user-1');

      expect(cartModel.create).not.toHaveBeenCalled();
      expect(result.total).toBe(50);
      expect(result.items).toEqual(existingCart.items);
    });
  });

  describe('addItem', () => {
    it('should throw NotFoundException when catalog does not return product', async () => {
      catalogService.findById.mockResolvedValue(null);

      await expect(
        service.addItem('user-1', { productId: 99, quantity: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(catalogService.findById).toHaveBeenCalledWith(99);
      expect(cartModel.findOne).not.toHaveBeenCalled();
    });

    it('should append new item and persist cart', async () => {
      const cart = createCartDoc('user-1', []);
      cartModel.findOne.mockResolvedValue(cart);
      catalogService.findById.mockResolvedValue({
        id: 1,
        title: 'Phone',
        price: 999,
        thumbnail: 'phone.jpg',
      });

      const result = await service.addItem('user-1', {
        productId: 1,
        quantity: 2,
      });

      expect(cart.items).toEqual([
        {
          productId: 1,
          title: 'Phone',
          price: 999,
          thumbnail: 'phone.jpg',
          quantity: 2,
        },
      ]);
      expect(cart.save).toHaveBeenCalled();
      expect(result.total).toBe(1998);
    });

    it('should merge quantity when item already exists', async () => {
      const cart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'Phone',
          price: 999,
          quantity: 1,
          thumbnail: 'phone.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(cart);
      catalogService.findById.mockResolvedValue({
        id: 1,
        title: 'Phone',
        price: 999,
        thumbnail: 'phone.jpg',
      });

      const result = await service.addItem('user-1', {
        productId: 1,
        quantity: 3,
      });

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(4);
      expect(result.total).toBe(3996);
      expect(cart.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateItem', () => {
    it('should throw NotFoundException when item is missing from cart', async () => {
      const cart = createCartDoc('user-1', []);
      cartModel.findOne.mockResolvedValue(cart);

      await expect(service.updateItem('user-1', 7, 3)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(cart.save).not.toHaveBeenCalled();
    });

    it('should replace quantity and recalculate total', async () => {
      const cart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'Phone',
          price: 100,
          quantity: 2,
          thumbnail: 'p.jpg',
        },
        {
          productId: 2,
          title: 'Mouse',
          price: 50,
          quantity: 1,
          thumbnail: 'm.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(cart);

      const result = await service.updateItem('user-1', 1, 5);

      expect(cart.items[0].quantity).toBe(5);
      expect(cart.save).toHaveBeenCalled();
      expect(result.total).toBe(550);
    });
  });

  describe('removeItem', () => {
    it('should remove item by productId and keep remaining items', async () => {
      const cart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'Phone',
          price: 100,
          quantity: 2,
          thumbnail: 'p.jpg',
        },
        {
          productId: 2,
          title: 'Mouse',
          price: 50,
          quantity: 1,
          thumbnail: 'm.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(cart);

      const result = await service.removeItem('user-1', 1);

      expect(cart.items).toEqual([
        {
          productId: 2,
          title: 'Mouse',
          price: 50,
          quantity: 1,
          thumbnail: 'm.jpg',
        },
      ]);
      expect(result.total).toBe(50);
      expect(cart.save).toHaveBeenCalled();
    });

    it('should keep cart unchanged when removing non-existing item', async () => {
      const initialItems = [
        {
          productId: 2,
          title: 'Mouse',
          price: 50,
          quantity: 1,
          thumbnail: 'm.jpg',
        },
      ];
      const cart = createCartDoc('user-1', [...initialItems]);
      cartModel.findOne.mockResolvedValue(cart);

      const result = await service.removeItem('user-1', 999);

      expect(cart.items).toEqual(initialItems);
      expect(result.total).toBe(50);
      expect(cart.save).toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it('should clear all items and return confirmation message', async () => {
      const cart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'Phone',
          price: 100,
          quantity: 1,
          thumbnail: 'p.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(cart);

      const result = await service.clearCart('user-1');

      expect(cart.items).toEqual([]);
      expect(cart.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Cart cleared' });
    });
  });

  describe('syncCart', () => {
    it('should merge incoming quantities, add new items and skip unknown products', async () => {
      const cart = createCartDoc('user-1', [
        {
          productId: 1,
          title: 'Phone',
          price: 100,
          quantity: 1,
          thumbnail: 'p.jpg',
        },
      ]);
      cartModel.findOne.mockResolvedValue(cart);

      catalogService.findById.mockImplementation((productId: number) => {
        if (productId === 1) {
          return { id: 1, title: 'Phone', price: 100, thumbnail: 'p.jpg' };
        }
        if (productId === 2) {
          return { id: 2, title: 'Mouse', price: 50, thumbnail: 'm.jpg' };
        }
        return null;
      });

      const result = await service.syncCart('user-1', [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
        { productId: 1, quantity: 1 },
        { productId: 999, quantity: 4 },
      ]);

      expect(catalogService.findById).toHaveBeenCalledTimes(4);
      expect(cart.items).toEqual([
        {
          productId: 1,
          title: 'Phone',
          price: 100,
          quantity: 4,
          thumbnail: 'p.jpg',
        },
        {
          productId: 2,
          title: 'Mouse',
          price: 50,
          quantity: 3,
          thumbnail: 'm.jpg',
        },
      ]);
      expect(result.total).toBe(550);
      expect(cart.save).toHaveBeenCalledTimes(1);
    });
  });
});
