import { Field, InputType } from 'type-graphql';
import { Message } from '../message.schema';

@InputType()
export class CreateMessageInput implements Partial<Message> {
  @Field()
  chatId: string;

  @Field(() => [String])
  fileIds?: string[] = [];

  @Field()
  text?: string;
}
