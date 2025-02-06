import Dexie, { type EntityTable } from 'dexie';
import { Conversation, Message } from './entities';

export default class DB extends Dexie {
  messages!: EntityTable<Message, 'id'>;
  conversations!: EntityTable<Conversation, 'id'>;

  constructor() {
    super('ChatsDB');
    this.version(1).stores({
      messages: 'id, conversationId, type',
      conversations: 'id',
    });
    this.messages.mapToClass(Message);
    this.conversations.mapToClass(Conversation);
  }
}

export const db = new DB();
