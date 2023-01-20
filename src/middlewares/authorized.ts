import { createMethodDecorator } from 'type-graphql';
import { UserModel } from '../schemas/user/user.schema';

import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { AuthorizedContext } from 'types/AuthorizedContext';
import { Errors } from '../types/Errors';

export const Authorized = () => {
  return createMethodDecorator<AuthorizedContext>(async ({ context }, next) => {
    const token = context.req.headers.authorization as string;
    if (!token) throw new GraphQLError(Errors.unauthorized);

    const isValid = jwt.verify(token, process.env.JWT_KEY);
    if (!isValid) throw new GraphQLError(Errors.unauthorized);

    const decoded = jwt.decode(token) as {
      _id: string;
    };

    const user = await UserModel.findOne({
      _id: decoded._id,
      tokens: token,
    });
    if (!user) throw new GraphQLError(Errors.unauthorized);

    context.user = user;
    return next();
  });
};
