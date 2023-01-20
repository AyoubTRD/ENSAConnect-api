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
import { Chat } from '../schemas/chat/chat.schema';
import { CreateChatInput } from '../schemas/chat/inputs/create-chat.input';
import { Message } from '../schemas/message/message.schema';
import { ChatService } from '../services/chat.service';
import { AuthorizedContext } from '../types/AuthorizedContext';

@Resolver((of) => Chat)
export class ChatResolver {
  private chatService = new ChatService();

  @FieldResolver(() => Message, { nullable: true })
  lastMessage(@Root() root) {
    return this.chatService.getLastMessageInChat(root._id);
  }

  @Authorized()
  @Mutation(() => Chat)
  createChat(
    @Ctx() context: AuthorizedContext,
    @Arg('input') input: CreateChatInput,
  ): Promise<Chat> {
    return this.chatService.createChat(input);
  }

  @Authorized()
  @Query(() => [Chat])
  getChats(@Ctx() ctx: AuthorizedContext) {
    return this.chatService.getChatsForUser(ctx.user.id);
  }
}
