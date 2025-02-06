import Spline from '@splinetool/react-spline/next';
import { Hero } from '~/components';
import { ChatBox } from '~/components/chat-box';

const Home = () => {
  return (
    <div className='hide-scrollbar relative max-h-screen overflow-hidden'>
      <div className=' h-screen scale-[120%]'>
        <Spline scene='https://prod.spline.design/vvdKBoe9cyJsEWtU/scene.splinecode' />
        <Hero />
      </div>
      <ChatBox />
    </div>
  );
};

export default Home;
