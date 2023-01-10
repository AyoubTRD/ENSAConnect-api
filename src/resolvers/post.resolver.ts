import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Authorized } from '../middlewares/authorized';

import { Post, PostInput } from '../schemas/post.schema';
import { User } from '../schemas/user.schema';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Context } from 'types/Context';

@Resolver((of) => Post)
export class PostResolver {
  private postService = new PostService();
  private userService = new UserService();

  @FieldResolver((returns) => User)
  async author(@Root() root: any): Promise<User> {
    const post = root._doc as Post;
    return await this.userService.getUserById(post.authorId as string);
  }

  @Authorized()
  @Query((returns) => [Post])
  async getPosts(): Promise<Post[]> {
    return await this.postService.getAll();
  }

  @Authorized()
  @Mutation((returns) => Post)
  async createPost(
    @Ctx() ctx: Context,
    @Arg('post') post: PostInput,
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

    if (!post || post.authorId.toString() !== ctx.user.id) return false;

    await this.postService.deletePost(postId);

    return true;
  }
}
