import { Request } from 'express';
import { User } from '../schemas/user/user.schema';

export type AuthorizedContext = {
  req: Request;
  user: User;
};
