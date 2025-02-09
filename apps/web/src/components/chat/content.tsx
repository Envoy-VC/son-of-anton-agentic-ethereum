import { useEffect, useRef, useState } from 'react';
import { useChat } from '~/hooks';
import { cn } from '~/lib/utils';
import MDXRenderer from './mdx-renderer';

export const ChatContent = () => {
  const { messages } = useChat();

  const [_showScrollButton, setShowScrollButton] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!chatRef.current) {
      return;
    }
    const isAtBottom =
      chatRef.current.scrollHeight - chatRef.current.scrollTop <=
      chatRef.current.clientHeight + 50;
    setShowScrollButton(!isAtBottom);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className='hide-scrollbar flex h-full flex-1 flex-col gap-2 overflow-y-auto'
      onScroll={handleScroll}
      ref={chatRef}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={cn(
              'max-w-md whitespace-pre-line rounded-3xl p-3 text-white',
              msg.type === 'user' ? 'bg-blue-500' : '!text-black bg-[#EFF1F5]'
            )}
          >
            <MDXRenderer content={String(msg.text())} />
          </div>
        </div>
      ))}
    </div>
  );
};
