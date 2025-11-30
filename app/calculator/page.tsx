import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React from 'react'

const Home = () => {
  return (
    <div>

      <NavBar></NavBar>
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>Know exactly how much to feed <br /> no more guesswork</h1></li>
        </ul>
      </div> 


{/* phần cal */}
<div className="flex flex-col w-full min-h-screen justify-center items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay py-10 gap-8">
  
  {/* tiêu đề */}
  <div className="z-10">
    <div className="bg-white border-[3px] border-black rounded-full px-16 py-3 shadow-lg">
      <h2 className="text-2xl md:text-4xl font-black text-black tracking-wide uppercase">
        CALCULATE TIME
      </h2>
    </div>
  </div>

  {/* bảng */}
  <div className="z-10 w-full max-w-6xl px-4">
    <div className="bg-[#93C5FD] rounded-[40px] p-10 border-none shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
      
      {/* cột nhập dữ liệu*/}
      <div className="w-full md:w-1/3 space-y-4">
        {/* pikachu i choose you */}
        <div className="relative">
          <select className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none appearance-none cursor-pointer">
            <option>Select your pet</option>
            <option>Dog </option>
            <option>Cat </option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl font-bold">⌄</div>
        </div>

        {/* thuộc tính */}
        <div className="relative">
          <select className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none appearance-none cursor-pointer">
            <option>Select Activity Level</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl font-bold">⌄</div>
        </div>

        {/* chubby */}
        <div>
          <input 
            type="text" 
            placeholder="Enter Weight" 
            className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none placeholder-gray-500"
          />
        </div>

        {/* nút */}
        <button className="w-full mt-2 bg-[#5B5FFF] text-white text-lg md:text-xl font-black py-3 rounded-full border-[3px] border-black hover:bg-blue-700 hover:shadow-lg transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
          CALCULATE ➤
        </button>
      </div>

      {/* đầu ra */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
        {/* ảnh */}
        <div className="w-full h-48 relative flex items-center justify-center mb-4">
            <img 
              src="/images/cat-and-dog.png" 
              alt="Pet Silhouette" 
              className="object-contain h-full w-full grayscale brightness-0 contrast-200" 
            />
        </div>
        {/* số liệu */}
        <h3 className="text-xl md:text-2xl font-bold text-black text-center">
          Your cat need : ......(g) of food/day
        </h3>
      </div>

    </div>
  </div>

</div>
{/* phần cal */}


      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-200 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <div className="flex-1 items-center justify-center p-3 ">
          
          
          <label form="feedback"><h2>Little advice</h2></label><br/>
          <textarea className="block mx-auto w-3/4 h-80 bg-white text-black border-4 border-black p-4 font-bold resize-none outline-0" id="feedback" name="feedback" placeholder="Your feedback,"></textarea>
          <br/>
          
        </div>
      </div>

      <Footer></Footer>

    </div>
  )
}

export default Home