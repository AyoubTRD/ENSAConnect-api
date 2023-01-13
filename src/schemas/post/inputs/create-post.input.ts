import { Field, InputType } from 'type-graphql';
import { Post } from '../post.schema';

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field({ defaultValue: '' })
  text: string;

  @Field((of) => [String], { defaultValue: [] })
  fileIds: string[];
}
