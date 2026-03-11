import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
};

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
