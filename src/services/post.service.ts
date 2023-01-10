import { PostModel, Post, PostInput } from '../schemas/post.schema';

export class PostService {
  async getAll(): Promise<Post[]> {
    return (await PostModel.find()).map((p) => {
      p.files = p.files || [];

      return p;
    });
  }

  async createPost(id: string, { text, files }: PostInput) {
    const post = await PostModel.create({
      authorId: id,
      files,
      text,
    });
    return post;
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await PostModel.findById(id);
    return post || null;
  }

  deletePost(id: string) {
    return PostModel.findByIdAndDelete(id);
  }
}
