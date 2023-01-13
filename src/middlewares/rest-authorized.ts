import { RequestHandler, Request } from 'express';
import { User, UserModel } from '../schemas/user/user.schema';

import * as jwt from 'jsonwebtoken';
import { Errors } from '../types/Errors';

export type AuthorizedRequest = Request & {
  userId: string;
  user: User;
};

export const restAuthorized: RequestHandler = async (
  req: AuthorizedRequest,
  res,
  next,
) => {
  try {
    const token = req.headers.authorization as string;
    if (!token) return res.status(401).send(Errors.unauthorized);

    const isValid = jwt.verify(token, process.env.JWT_KEY);
    if (!isValid) res.status(401).send(Errors.unauthorized);

    const decoded = jwt.decode(token) as {
      _id: string;
    };

    const user = await UserModel.findOne({
      _id: decoded._id,
      tokens: token,
    });
    if (!user) res.status(401).send(Errors.unauthorized);

    req.user = user;
    req.userId = user.id;
    return next();
  } catch (e) {
    console.error(e);

    res.status(500).send();
  }
};
