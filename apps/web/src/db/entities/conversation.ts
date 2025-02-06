import { Entity } from 'dexie';
import type DB from '..';

export class Conversation extends Entity<DB> {
  id!: string;
  title!: string;

  async getAllMessages() {
    const messages = await this.db.messages
      .where('conversationId')
      .equals(this.id)
      .toArray();

    return messages.map((message) => message.deserialize());
  }
}
