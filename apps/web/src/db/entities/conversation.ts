import { Entity } from 'dexie';
import type DB from '..';

export class Conversation extends Entity<DB> {
  id!: string;
  title!: string;
}
