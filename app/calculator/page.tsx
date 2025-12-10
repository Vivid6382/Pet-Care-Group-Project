"use client";

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React, { useState } from 'react'

const Home = () => {
  // khai báo biến
  const [petType, setPetType] = useState("");
  const [activity, setActivity] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // hàm xử lý logic tính toán khi bấm nút
  const handleCalculate = () => {
    // chuyển cân nặng từ chuỗi sang số
    const w = parseFloat(weight);

    // kiểm tra nhập đủ thông tin chưa
    if (!petType || !activity || isNaN(w)) {
      alert("Please select pet type, activity level and enter valid weight!");
      return;
    }

    let a = 0;
    if (activity === "low") a = 1.2;
    else if (activity === "normal") a = 1.4;
    else if (activity === "high") a = 2.0;

    let cal = 0;

    // áp dụng công thức
    if (petType === "dog") {
      cal = (70 * Math.pow(w, 0.75)) * a;
    } else if (petType === "cat") {
      cal = (30 * w + 70) * a;
    }

    // làm tròn kết quả (không lấy số thập phân) và lưu vào biến result
    setResult(cal.toFixed(0));
  };

  return (
    <div>
      <NavBar></NavBar>
      
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white text-center'>Know exactly how much to feed <br /> no more guesswork</h1></li>
        </ul>
      </div>

      {/* calculator */}
      <div className="flex flex-col w-full min-h-screen justify-center items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay py-10 gap-8">
        
        {/* Tiêu đề */}
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
            
            {/* cột nhập liệu */}
            <div className="w-full md:w-1/3 space-y-4">
              
              {/* chọn thú cưng */}
              <div className="relative">
                <select 
                  className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none appearance-none cursor-pointer"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                >
                  <option value="">Select your pet</option>
                  <option value="dog">Dog </option>
                  <option value="cat">Cat </option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl font-bold">⌄</div>
              </div>

              {/* chọn mức độ hoạt động */}
              <div className="relative">
                <select 
                  className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none appearance-none cursor-pointer"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  <option value="">Select Activity Level</option>
                  <option value="low">Low (1.2)</option>
                  <option value="normal">Normal (1.4)</option>
                  <option value="high">High (2.0)</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-xl font-bold">⌄</div>
              </div>

              {/* cân nặng */}
              <div>
                <input 
                  type="number" // đổi thành number để nhập số dễ hơn trên điện thoại
                  placeholder="Enter Weight (kg)" 
                  className="w-full p-4 text-lg md:text-xl font-bold text-gray-700 bg-white border-[3px] border-black focus:outline-none placeholder-gray-500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              {/* nút calculate */}
              <button 
                onClick={handleCalculate}
                className="block mx-auto w-full font-bold text-2xl text-white bg-blue-500 rounded-full border-4 border-black p-3 text-center hover:bg-white hover:text-blue-500 transition-all duration-200"
              >
                CALCULATE ➤
              </button>
            </div>

            {/* cột hiển thị kết quả */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
              {/* ảnh minh họa */}
              <div className="w-full h-48 relative flex items-center justify-center mb-4">
                  <img 
                    src="/images/cat-and-dog.png" 
                    alt="Pet Silhouette" 
                    className="object-contain h-full w-full grayscale brightness-0 contrast-200" 
                  />
              </div>
              
              {/* text kết quả */}
              <h3 className="text-xl md:text-2xl font-bold text-black text-center min-h-[3rem]">
                {result ? (
                  <>
                    Your {petType || "pet"} needs : <br/>
                    <span className="text-3xl text-[#5B5FFF]">{result}</span> (calories/day)
                  </>
                ) : (
                  "Your pet needs : ......(cal) of food/day"
                )}
              </h3>
            </div>

          </div>
        </div>

      </div>

      {/* Phần Advice */}
      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
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