import Spline from '@splinetool/react-spline/next';

const Home = () => {
  return (
    <div className='hide-scrollbar max-h-screen overflow-hidden'>
      <div className='h-screen scale-[120%]'>
        <Spline scene='https://prod.spline.design/vvdKBoe9cyJsEWtU/scene.splinecode' />
      </div>
    </div>
  );
};

export default Home;
