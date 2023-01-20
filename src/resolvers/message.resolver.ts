import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Authorized } from '../middlewares/authorized';
import { CreateMessageInput } from '../schemas/message/inputs/create-message.input';
import { Message } from '../schemas/message/message.schema';
import { MessageService } from '../services/message.service';
import { AuthorizedContext } from '../types/AuthorizedContext';

@Resolver((of) => Message)
export class MessageResolver {
  private messageService = new MessageService();

  @Authorized()
  @Mutation(() => Message)
  createMessage(
    @Ctx() context: AuthorizedContext,
    @Arg('input') input: CreateMessageInput,
  ): Promise<Message> {
    return this.messageService.createMessage(context.user.id, input);
  }

  @Authorized()
  @Query(() => [Message])
  getChatMessages(@Arg('chatId') chatId: string): Promise<Message[]> {
    return this.messageService.getMessagesForChat(chatId);
  }
}
