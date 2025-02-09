import { Entity } from 'dexie';
import type DB from '..';

import type { CoreAssistantMessage, CoreToolMessage } from 'ai';

export class Message extends Entity<DB> {
  id!: number;
  conversationId!: string;
  type!: string;
  data!: CoreAssistantMessage | CoreToolMessage;

  text() {
    if (this.type === 'assistant') {
      if (Array.isArray(this.data.content)) {
        if (this.data.content[0] && this.data.content[0].type === 'text') {
          return this.data.content[0].text;
        }
        return '';
      }
      return this.data.content;
    }
    return '';
  }
}
