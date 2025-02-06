import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../../scene/canvas'), { ssr: false });

const ChatPage = () => {
  return (
    <div className='h-screen'>
      <Canvas />
    </div>
  );
};

export default ChatPage;
