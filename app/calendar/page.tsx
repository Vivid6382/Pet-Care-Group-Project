import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import Calendar from "@/components/GoogleCalendar";

const Page = () => {
  return (
    <div>
      <NavBar />
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>Never miss a moment</h1></li>
        </ul>
      </div> 

      <div className="flex w-full justify-center p-5 ">
        <div className="w-full max-w-6xl">
           <Calendar />
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Page;