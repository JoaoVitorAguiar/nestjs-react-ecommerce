import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let cartService: {
    getCart: jest.Mock;
    addItem: jest.Mock;
    syncCart: jest.Mock;
    updateItem: jest.Mock;
    removeItem: jest.Mock;
    clearCart: jest.Mock;
  };

  beforeEach(() => {
    cartService = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      syncCart: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    controller = new CartController(cartService as unknown as CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate getCart with authenticated user id', async () => {
    const req = { user: { sub: 'user-1' } };
    const expected = { items: [], total: 0 };
    cartService.getCart.mockResolvedValue(expected);

    const result = await controller.getCart(req);

    expect(cartService.getCart).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(expected);
  });

  it('should delegate addItem with dto and user id', async () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { productId: 10, quantity: 2 };
    const expected = { items: [{ productId: 10, quantity: 2 }], total: 40 };
    cartService.addItem.mockResolvedValue(expected);

    const result = await controller.addItem(req, dto);

    expect(cartService.addItem).toHaveBeenCalledWith('user-1', dto);
    expect(result).toEqual(expected);
  });

  it('should delegate syncCart using dto.items', async () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { items: [{ productId: 10, quantity: 2 }] };
    const expected = { items: [{ productId: 10, quantity: 3 }], total: 60 };
    cartService.syncCart.mockResolvedValue(expected);

    const result = await controller.syncCart(req, dto);

    expect(cartService.syncCart).toHaveBeenCalledWith('user-1', dto.items);
    expect(result).toEqual(expected);
  });

  it('should delegate updateItem with parsed productId and quantity', async () => {
    const req = { user: { sub: 'user-1' } };
    const dto = { quantity: 5 };
    const expected = { items: [{ productId: 10, quantity: 5 }], total: 100 };
    cartService.updateItem.mockResolvedValue(expected);

    const result = await controller.updateItem(req, 10, dto);

    expect(cartService.updateItem).toHaveBeenCalledWith('user-1', 10, 5);
    expect(result).toEqual(expected);
  });

  it('should delegate removeItem with user id and productId', async () => {
    const req = { user: { sub: 'user-1' } };
    const expected = { items: [], total: 0 };
    cartService.removeItem.mockResolvedValue(expected);

    const result = await controller.removeItem(req, 10);

    expect(cartService.removeItem).toHaveBeenCalledWith('user-1', 10);
    expect(result).toEqual(expected);
  });

  it('should delegate clearCart with user id', async () => {
    const req = { user: { sub: 'user-1' } };
    const expected = { message: 'Cart cleared' };
    cartService.clearCart.mockResolvedValue(expected);

    const result = await controller.clearCart(req);

    expect(cartService.clearCart).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(expected);
  });
});
