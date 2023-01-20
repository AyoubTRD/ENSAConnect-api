import { CreateMessageInput } from '../schemas/message/inputs/create-message.input';
import { Message, MessageModel } from '../schemas/message/message.schema';
import { DbDocument } from '../types/DbDocument';

export class MessageService {
  createMessage(
    userId: string,
    input: CreateMessageInput,
  ): Promise<DbDocument<Message>> {
    return MessageModel.create({
      ...input,
      userId,
    });
  }

  async getMessagesForChat(chatId: string): Promise<Message[]> {
    return MessageModel.find({
      chatId,
    })
      .sort({
        createdAt: 'desc',
      })
      .lean();
  }
}
