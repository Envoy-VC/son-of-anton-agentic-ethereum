import dynamic from 'next/dynamic';
import { ChatBox } from '~/components';

const Canvas = dynamic(() => import('../../scene/canvas'), { ssr: false });

const ChatPage = () => {
  return (
    <div className='relative h-screen'>
      <Canvas />
      <ChatBox />
    </div>
  );
};

export default ChatPage;
