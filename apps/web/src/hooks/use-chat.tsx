import type { StoredMessage } from '@langchain/core/messages';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLocalStorage } from 'usehooks-ts';

import { db } from '~/db';

const useChat = () => {
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
    return messages;
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

  const getChatMessages = async () => {
    if (!activeChatId) {
      return [];
    }
    const messages = await db.messages
      .where('conversationId')
      .equals(activeChatId)
      .toArray();
    return messages;
  };

  const addMessages = async (messages: StoredMessage[]) => {
    let chatId = activeChatId;
    if (!chatId) {
      chatId = await createNewChat();
    }

    await db.messages.bulkAdd(
      messages.map((message) => ({
        id: crypto.randomUUID(),
        conversationId: chatId,
        type: message.type,
        data: message.data,
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

export default useChat;
