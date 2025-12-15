import BlueButton from '@/components/BlueButton'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div>

      <NavBar></NavBar>
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>10k+ USER</h1><h2 className='text-white'>Trust Our Website</h2></li>
          <li><h1 className='text-white'>Information</h1><h2 className='text-white'>Information</h2></li>
          <li><h1 className='text-white'>Information</h1><h2 className='text-white'>Information</h2></li>
          <li><h1 className='text-white'>Information</h1><h2 className='text-white'>Information</h2></li>
        </ul>
      </div> 

      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-100 bg-[url('/images/syringe-on-dog.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <div className="flex-1">
          <h1>Because your pet<br/>deserve better care</h1>
          <Link className='commonbtn2' href='/'>GET STARTED ➜</Link>
          <h2>Contact us : XXX-XXX-XXX </h2>
        </div>
        <div className='flex-1'>
          <img src="/images/cat-and-dog.png"></img>
        </div>
      </div>

      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-100">
        <div className="flex-1">
          <img src="/images/man-pat-dog.png"></img>
        </div>
        <div className='flex-1'>
          <h1>About us</h1>
          <h3 className='w-3/4'>PetCare🐾 brings technology and love together to care for pets.<br/>Track feeding, plan events, and monitor health — all in one simple, friendly website.</h3>
          <Link className='commonbtn2' href='/'>GET STARTED ➜</Link>
        </div>
      </div>

      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-200 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <div className="flex-1 items-center justify-center p-3 ">
          <form>
          <p className='block w-2/3 mx-auto font-bold text-4xl text-black bg-white border-black border-4 rounded-full p-3 text-center'>TKS U FOR USING OUR WEBSITE</p><br/>
          <label form="feedback"><h2>We truly appreciate your feedback! Feel free to contact us anytime at </h2></label><br/>
          <textarea className="block mx-auto w-3/4 h-60 bg-white text-black border-4 border-black p-4 font-bold resize-none outline-0" id="feedback" name="feedback" placeholder="Your feedback,"></textarea>
          <br/>
          <BlueButton>Submit</BlueButton>
          </form>
        </div>
      </div>

      <Footer></Footer>

    </div>
  )
}

export default Home