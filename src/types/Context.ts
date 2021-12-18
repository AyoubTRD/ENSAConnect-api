import { Request } from 'express';
import { User } from '../schemas/User';

export type Context = {
  req: Request;
  user: User;
};
