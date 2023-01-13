import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from 'type-graphql';
import { GraphQLError } from 'graphql';
import { Authorized } from '../middlewares/authorized';

import { Post } from '../schemas/post/post.schema';
import { CreatePostInput } from '../schemas/post/inputs/create-post.input';
import { User } from '../schemas/user/user.schema';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Context } from 'types/Context';
import { Errors } from '../types/Errors';
import { UpdatePostInput } from '../schemas/post/inputs/update-post.input';
import { MediaFile } from '../schemas/file/mediafile.schema';
import { MediaFileService } from '../services/mediafile.service';

@Resolver((of) => Post)
export class PostResolver {
  private postService = new PostService();
  private userService = new UserService();
  private mediaFileService = new MediaFileService();

  @FieldResolver((returns) => User)
  async author(@Root() root: any): Promise<User> {
    const post = root._doc as Post;
    return this.userService.getUserById(post.authorId as string);
  }

  @FieldResolver((returns) => [MediaFile])
  async files(@Root() root: any): Promise<MediaFile[]> {
    const post = root._doc as Post;
    return this.mediaFileService.getMediaFilesByIds(post.fileIds as string[]);
  }

  @Authorized()
  @Query((returns) => [Post])
  async getPosts(): Promise<Post[]> {
    return this.postService.getAll();
  }

  @Authorized()
  @Mutation((returns) => Post)
  async createPost(
    @Ctx() ctx: Context,
    @Arg('post') post: CreatePostInput,
  ): Promise<Post> {
    return await this.postService.createPost(ctx.user.id, post);
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async deletePost(
    @Ctx() ctx: Context,
    @Arg('postId') postId: string,
  ): Promise<boolean> {
    const post = await this.postService.getPostById(postId);

    if (!post || post.authorId.toString() !== ctx.user.id.toString())
      return false;

    await this.postService.deletePost(postId);

    return true;
  }

  @Authorized()
  @Mutation((returns) => Post)
  async updatePost(
    @Ctx() context: Context,
    @Arg('postId') postId: string,
    @Arg('input') input: UpdatePostInput,
  ) {
    let post = await this.postService.getPostById(postId);

    if (post.authorId.toString() !== context.user.id.toString())
      throw new GraphQLError(Errors.unauthorized);

    return this.postService.updatePost(post, input);
  }
}
