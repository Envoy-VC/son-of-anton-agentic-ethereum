import { Entity } from 'dexie';
import type DB from '..';

import {
  type StoredMessage,
  mapStoredMessageToChatMessage,
} from '@langchain/core/messages';

export class Message extends Entity<DB> {
  id!: number;
  conversationId!: string;
  type!: string;
  data!: StoredMessage['data'];

  text() {
    return this.data.content;
  }

  deserialize() {
    return mapStoredMessageToChatMessage({ type: this.type, data: this.data });
  }
}
