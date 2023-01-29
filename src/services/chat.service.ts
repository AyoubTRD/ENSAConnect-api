import { Chat, ChatModel } from '../schemas/chat/chat.schema';
import { CreateChatInput } from '../schemas/chat/inputs/create-chat.input';
import { Message, MessageModel } from '../schemas/message/message.schema';
import { DbDocument } from '../types/DbDocument';

export class ChatService {
  createChat(input: CreateChatInput): Promise<DbDocument<Chat>> {
    return ChatModel.create({ ...input });
  }

  async getChatsForUser(userId: string): Promise<Chat[]> {
    return ChatModel.find({ userIds: userId })
      .sort({ createdAt: 'desc' })
      .lean();
  }

  async getChatById(chatId: string): Promise<DbDocument<Chat>> {
    return ChatModel.findById(chatId);
  }

  async getLastMessageInChat(chatId: string): Promise<Message | null> {
    return MessageModel.find({ chatId })
      .sort({ createdAt: 'desc' })
      .limit(1)
      .lean()[0];
  }
}
