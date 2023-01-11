import { Request } from 'express';
import { User } from '../schemas/user/user.schema';

export type Context = {
  req: Request;
  user: User;
};
