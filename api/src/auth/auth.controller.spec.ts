import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signUp: jest.Mock; signIn: jest.Mock };

  beforeEach(() => {
    authService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    };

    controller = new AuthController(authService as unknown as AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate signUp to AuthService', async () => {
    const dto = {
      name: 'Maria',
      email: 'maria@email.com',
      password: '123456',
    };
    const expected = { message: 'User created successfully' };
    authService.signUp.mockResolvedValue(expected);

    const result = await controller.signUp(dto);

    expect(authService.signUp).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should delegate signIn to AuthService', async () => {
    const dto = {
      email: 'maria@email.com',
      password: '123456',
    };
    const expected = { access_token: 'jwt-token' };
    authService.signIn.mockResolvedValue(expected);

    const result = await controller.signIn(dto);

    expect(authService.signIn).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should return request user in profile', () => {
    const req = {
      user: {
        sub: 'user-id',
        email: 'maria@email.com',
      },
    };

    expect(controller.profile(req)).toEqual(req.user);
  });
});
