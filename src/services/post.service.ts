import { PostModel, Post, PostInput } from '../schemas/post.schema';

export class PostService {
  async getAll(): Promise<Post[]> {
    return await PostModel.find();
  }

  async createPost(id: string, { text, files }: PostInput) {
    const post = await PostModel.create({
      authorId: id,
      files,
      text,
    });
    return post;
  }
}
