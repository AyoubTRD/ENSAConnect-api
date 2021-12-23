import { createMethodDecorator } from 'type-graphql';
import { UserModel } from '../schemas/user.schema';

import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { Context } from 'types/Context';

export const Authorized = () => {
  return createMethodDecorator<Context>(async ({ context }, next) => {
    const token = context.req.headers.authorization as string;
    if (!token) throw new GraphQLError('unauthorized');
    const isValid = jwt.verify(token, process.env.JWT_KEY);
    if (!isValid) throw new GraphQLError('unauthorized');

    const decoded = jwt.decode(token) as {
      _id: string;
    };

    const user = await UserModel.findOne({
      _id: decoded._id,
      tokens: token,
    });
    if (!user) throw new GraphQLError('unauthorized');
    context.user = user;
    return next();
  });
};
