import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import {
  UserModel,
  AuthResult,
  Credentials,
  User,
  UserInput,
  UpdateUserInput,
} from '../schemas/User';

import { GraphQLError } from 'graphql';
import { Authorized } from '../middlewares/authorized';
import { Context } from '../types/Context';

import { UserService } from '../services/user.service';

@Resolver((of) => User)
export class UserResolver {
  private userService = new UserService();

  @Query((returns) => [User])
  async getUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deleteToken(@Ctx() ctx: Context): Promise<boolean> {
    try {
      await this.userService.deleteToken({
        id: ctx.user._id,
        token: ctx.req.headers.authorization,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deleteMe(@Ctx() ctx: Context): Promise<boolean> {
    try {
      await this.userService.deleteUser({ id: ctx.user._id });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Mutation((returns) => AuthResult)
  async createUser(
    @Arg('user') input: UserInput,
  ): Promise<{ token: string; user: User }> {
    try {
      const newUser = await this.userService.createUser(input);
      const [token, user] = await this.userService.generateTokenForUser({
        id: newUser._id,
      });
      return { token, user };
    } catch (e) {
      console.error(e);
      throw new GraphQLError('email_taken');
    }
  }

  @Authorized()
  @Mutation((returns) => User)
  async updateUser(
    @Arg('user')
    input: UpdateUserInput,
    @Ctx() ctx: Context,
  ): Promise<User> {
    return await this.userService.updateUser(ctx.user._id, input);
  }

  @Query((returns) => AuthResult)
  async getToken(
    @Arg('credentials') { email, password }: Credentials,
  ): Promise<AuthResult> {
    const userToAuthenticate = await this.userService.getUserWithCredentials({
      email,
      password,
    });
    const [token, user] = await this.userService.generateTokenForUser({
      id: userToAuthenticate._id,
    });
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
}
