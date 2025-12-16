import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

const Page = () => {
  return (
    <div>
      <NavBar />
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>Never miss a moment</h1></li>
        </ul>
      </div> 
      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-200 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
      </div>

      <Footer />
    </div>
  );
};

export default Page;
