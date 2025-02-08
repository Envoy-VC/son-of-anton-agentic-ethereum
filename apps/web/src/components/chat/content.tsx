import { useRef, useState } from 'react';

export const ChatContent = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
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

  return (
    <div
      className='h-full flex-1 overflow-y-auto border'
      onScroll={handleScroll}
      ref={chatRef}
    >
      ChatContent
    </div>
  );
};
