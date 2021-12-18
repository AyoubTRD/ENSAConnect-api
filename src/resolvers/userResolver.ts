import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import {
  UserModel,
  AuthResult,
  Credentials,
  User,
  UserInput,
} from '../schemas/User';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { Authorized } from '../middlewares/authorized';
import { Context } from 'types/Context';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find();
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deleteToken(@Ctx() ctx: Context): Promise<boolean> {
    try {
      const token = ctx.req.headers.authorization;
      ctx.user.tokens.splice(ctx.user.tokens.indexOf(token), 1);
      await UserModel.findOneAndUpdate({ _id: ctx.user._id }, ctx.user);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Query((returns) => AuthResult)
  async getToken(
    @Arg('credentials') { email, password }: Credentials,
  ): Promise<AuthResult> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new GraphQLError('wrong_email');
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) throw new GraphQLError('wrong_password');
    const token = this.generateToken(user._id);
    user.tokens.push(token);
    await user.save();
    return {
      user,
      token,
    };
  }

  @Authorized()
  @Query((returns) => User)
  getMe(@Ctx() ctx: Context): User {
    return ctx.user;
  }

  @Query((returns) => User, { nullable: true })
  async getUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  @Mutation((returns) => AuthResult)
  async createUser(
    @Arg('user') { email, firstName, lastName, avatar, password }: UserInput,
  ): Promise<{ token: string; user: User }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const user = await UserModel.create({
        email,
        avatar,
        firstName,
        lastName,
        password: hashedPassword,
      });
      const token = this.generateToken(user._id);
      user.tokens.push(token);
      await user.save();
      return { token, user };
    } catch (e) {
      console.error(e);
      throw new GraphQLError('email_taken');
    }
  }

  generateToken(id: string): string {
    const token = jwt.sign({ _id: id }, process.env.JWT_KEY);
    return token;
  }
}
