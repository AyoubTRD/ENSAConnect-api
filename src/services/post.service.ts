import { PostModel, Post } from '../schemas/post/post.schema';
import { CreatePostInput } from '../schemas/post/inputs/create-post.input';
import { UpdatePostInput } from '../schemas/post/inputs/update-post.input';
import { DbDocument } from '../types/DbDocument';

export class PostService {
  async getAll(): Promise<Post[]> {
    return PostModel.find();
  }

  async createPost(authorId: string, { text, fileIds }: CreatePostInput) {
    const post = await PostModel.create({
      authorId,
      fileIds,
      text,
    });
    return post;
  }

  async getPostById(id: string): Promise<DbDocument<Post>> {
    const post = await PostModel.findById(id);
    return post || null;
  }

  async updatePostById(id: string, input: UpdatePostInput): Promise<Post> {
    const post = await PostModel.findById(id);

    return this.updatePost(post, input);
  }

  async updatePost(post: DbDocument<Post>, { text, fileIds }: UpdatePostInput) {
    if (text != null && text != undefined) post.text = text;
    if (fileIds) post.fileIds = fileIds;

    await post.save();

    return post;
  }

  deletePost(id: string) {
    return PostModel.findByIdAndDelete(id);
  }
}
