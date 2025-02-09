import type {
  CoreAssistantMessage,
  CoreToolMessage,
  CoreUserMessage,
} from 'ai';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLocalStorage } from 'usehooks-ts';

import { db } from '~/db';

export const useChat = () => {
  const [activeChatId, setActiveChatId] = useLocalStorage<string | null>(
    'activeChatId',
    null
  );

  const messages = useLiveQuery(async () => {
    if (!activeChatId) {
      return [];
    }
    const messages = await db.messages
      .where('conversationId')
      .equals(activeChatId)
      .toArray();
    return messages.filter((m) => m.text().length > 0);
  }, [activeChatId]);

  const chats = useLiveQuery(async () => {
    const chats = await db.conversations.toArray();
    return chats;
  }, []);

  const createNewChat = async () => {
    const chatId = crypto.randomUUID();
    await db.conversations.add({ id: chatId, title: 'New Chat' });
    setActiveChatId(chatId);
    return chatId;
  };

  const deleteChat = async (chatId: string) => {
    await db.conversations.delete(chatId);
    setActiveChatId(null);
  };

  const addMessages = async (
    messages: (CoreAssistantMessage | CoreToolMessage | CoreUserMessage)[]
  ) => {
    let chatId = activeChatId;
    if (!chatId) {
      chatId = await createNewChat();
    }

    await db.messages.bulkAdd(
      messages.map((message) => ({
        conversationId: chatId,
        type: message.role,
        data: message,
      }))
    );
  };

  return {
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    messages: messages ?? [],
    chats: chats ?? [],
    addMessages,
  };
};
