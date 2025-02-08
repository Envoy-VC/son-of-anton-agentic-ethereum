import dynamic from 'next/dynamic';
import { ChatBox, ChatsButton } from '~/components';

const Canvas = dynamic(() => import('../../scene/canvas'), { ssr: false });

const ChatPage = () => {
  return (
    <div className='relative h-screen'>
      <Canvas />
      <ChatBox className='absolute right-1/2 bottom-12 mx-auto mt-6 w-full max-w-md translate-x-1/2' />
      <ChatsButton />
    </div>
  );
};

export default ChatPage;
