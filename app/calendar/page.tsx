import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import GoogleCalendar from '@/components/GoogleCalendar';

const Page = () => {
  return (
    <div>
      <NavBar />
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>Never miss a moment</h1></li>
        </ul>
      </div> 
      <div className="flex w-full justify-center p-5 items-start gap-10">
      <GoogleCalendar />
      </div>

      <Footer />
    </div>
  );
};

export default Page;
