import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import { UserModel, AuthResult, User } from '../schemas/user/user.schema';
import { CredentialsInput } from '../schemas/user/inputs/credentials.input';
import { UpdateUserInput } from '../schemas/user/inputs/update-user.input';
import { CreateUserInput } from '../schemas/user/inputs/create-user.input';

import { GraphQLError } from 'graphql';
import { Authorized } from '../middlewares/authorized';
import { AuthorizedContext } from '../types/AuthorizedContext';

import { UserService } from '../services/user.service';
import { Errors } from '../types/Errors';
import { MediaFileService } from '../services/mediafile.service';
import { MediaFile } from '../schemas/file/mediafile.schema';

@Resolver((of) => User)
export class UserResolver {
  private userService = new UserService();
  private mediaService = new MediaFileService();

  @FieldResolver((returns) => MediaFile, { nullable: true })
  avatar(@Root() root) {
    const user = (root._doc || root) as User;
    if (!user.avatarFileId) return null;
    return this.mediaService.getMediaFileById(user.avatarFileId as string);
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deleteToken(@Ctx() ctx: AuthorizedContext): Promise<boolean> {
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
  async deleteMe(@Ctx() ctx: AuthorizedContext): Promise<boolean> {
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
    @Arg('user') input: CreateUserInput,
  ): Promise<{ token: string; user: User }> {
    try {
      const newUser = await this.userService.createUser(input);
      const [token, user] = await this.userService.generateTokenForUser({
        id: newUser._id,
      });
      return { token, user };
    } catch (e) {
      console.error(e);
      throw new GraphQLError(Errors.email_taken);
    }
  }

  @Authorized()
  @Mutation((returns) => User)
  async updateUser(
    @Arg('user')
    input: UpdateUserInput,
    @Ctx() ctx: AuthorizedContext,
  ): Promise<User> {
    if (
      (!input.firstName && !input.lastName) ||
      (input.firstName == ctx.user.firstName &&
        input.lastName == ctx.user.lastName)
    ) {
      delete input.firstName;
      delete input.lastName;
    }
    return this.userService.updateUser(ctx.user._id, input);
  }

  @Query((returns) => AuthResult)
  async getToken(
    @Arg('credentials') { email, password }: CredentialsInput,
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
  getMe(@Ctx() ctx: AuthorizedContext): User {
    return ctx.user;
  }

  @Query((returns) => User, { nullable: true })
  async getUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }
}
