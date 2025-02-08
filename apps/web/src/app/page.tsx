import Spline from '@splinetool/react-spline/next';
import { Hero } from '~/components';

const Home = () => {
  return (
    <div className='hide-scrollbar relative max-h-screen overflow-hidden'>
      <div className=' h-screen scale-[120%]'>
        <Spline scene='https://prod.spline.design/vvdKBoe9cyJsEWtU/scene.splinecode' />
        <Hero />
      </div>
    </div>
  );
};

export default Home;
