import { Field, InputType } from 'type-graphql';
import { Post } from '../post.schema';

@InputType()
export class UpdatePostInput implements Partial<Post> {
  @Field({ nullable: true })
  text?: string;

  @Field((of) => [String], { nullable: true })
  files?: string[];
}
