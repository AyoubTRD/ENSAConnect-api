import { ArrayMinSize } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Chat } from '../chat.schema';

@InputType()
export class CreateChatInput implements Partial<Chat> {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [String])
  @ArrayMinSize(2)
  userIds: string[];
}
