import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  type UserModelInstance = {
    save: jest.Mock<Promise<void>, []>;
  };

  type UserModelConstructorInput = {
    name: string;
    email: string;
    passwordHash: string;
  };

  let service: AuthService;
  let saveMock: jest.Mock<Promise<void>, []>;
  let userModel: jest.Mock<UserModelInstance, [UserModelConstructorInput]> & {
    findOne: jest.Mock<
      Promise<{ _id: string; passwordHash?: string } | null>,
      [{ email: string }]
    >;
  };
  let jwtService: { signAsync: jest.Mock };
  let configService: { get: jest.Mock };

  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const findOne = jest.fn();
    saveMock = jest.fn<Promise<void>, []>().mockResolvedValue(undefined);

    userModel = Object.assign(
      jest.fn().mockImplementation((data: UserModelConstructorInput) => ({
        ...data,
        save: saveMock,
      })),
      { findOne },
    );

    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue(10),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const dto = {
      name: 'Maria',
      email: 'maria@email.com',
      password: '123456',
    };

    it('should throw ConflictException when email already exists', async () => {
      userModel.findOne.mockResolvedValue({ _id: 'existing-user' });

      await expect(service.signUp(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });

    it('should create a user and return success message', async () => {
      userModel.findOne.mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.signUp(dto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(configService.get).toHaveBeenCalledWith('bcrypt.rounds');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(userModel).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        passwordHash: 'hashed-password',
      });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('signIn', () => {
    const dto = {
      email: 'maria@email.com',
      password: '123456',
    };

    it('should throw UnauthorizedException when user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userModel.findOne.mockResolvedValue({
        _id: 'user-id',
        passwordHash: 'stored-hash',
      });
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        'stored-hash',
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should return access token when credentials are valid', async () => {
      userModel.findOne.mockResolvedValue({
        _id: 'user-id',
        passwordHash: 'stored-hash',
      });
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.signIn(dto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        'stored-hash',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'user-id' });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });
});
