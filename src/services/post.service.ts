import { PostModel, Post } from '../schemas/post/post.schema';
import { CreatePostInput } from '../schemas/post/inputs/create-post.input';
import { UpdatePostInput } from '../schemas/post/inputs/update-post.input';
import { Document } from 'mongoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';

export class PostService {
  async getAll(): Promise<Post[]> {
    return (await PostModel.find()).map((p) => {
      p.files = p.files || [];

      return p;
    });
  }

  async createPost(authorId: string, { text, files }: CreatePostInput) {
    const post = await PostModel.create({
      authorId,
      files,
      text,
    });
    return post;
  }

  async getPostById(
    id: string,
  ): Promise<(Post & Document<string, BeAnObject, Post>) | null> {
    const post = await PostModel.findById(id);
    return post || null;
  }

  async updatePostById(id: string, input: UpdatePostInput): Promise<Post> {
    const post = await PostModel.findById(id);

    return this.updatePost(post, input);
  }

  async updatePost(
    post: Document<string, BeAnObject, Post> & Post,
    { text, files }: UpdatePostInput,
  ) {
    if (text != null && text != undefined) post.text = text;
    if (files) post.files = files;

    await post.save();

    return post;
  }

  deletePost(id: string) {
    return PostModel.findByIdAndDelete(id);
  }
}
