import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async signUp(dto: SignUpDto) {

    const userExists = await this.userModel.findOne({ email: dto.email });

    if (userExists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hash(dto.password);

    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash
    });

    await user.save();

    return {
      message: 'User created successfully'
    };
  }

  async signIn(dto: SignInDto) {

    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.verify(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken
    };
  }


  private async hash(password: string): Promise<string> {
    const rounds = this.configService.get<number>('bcrypt.rounds')!;
    return bcrypt.hash(password, rounds);
  }

  private async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
