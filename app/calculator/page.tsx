"use client";

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { useState } from 'react'

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
      <div className="flex flex-col w-full h-full justify-center items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay py-5 gap-5">
        
        {/* Tiêu đề */}
      <p className='block w-2/5 mx-auto font-bold text-4xl text-black bg-white border-black border-4 rounded-full p-3 text-center'>CALCULATE TIME</p>


        {/* bảng */}
        <div className="w-full max-w-6xl px-4">
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
                  <option value="low">Sedentary (1.2)</option>
                  <option value="normal">Moderately (1.4)</option>
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
<div className="flex flex-col w-full h-full justify-center items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay py-14 gap-14">
        <div className="bg-white border-[3px] border-black rounded-[30px] p-8 md:p-12 shadow-xl max-w-4xl w-full">
            
            <h2 className="flex items-center gap-6 p-2 ">note</h2>

<div className="flex flex-col gap-6">
                
                {/* Step 1 */}
                <div className="flex items-center gap-6 p-2">
                    <div className="bg-blue-500 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center border-2 border-black flex-shrink-0 text-2xl shadow-md">1</div>
                    <p className="text-lg font-bold ">
                      A sedentary pet is one that doesn’t move much during the day.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-6 p-2">
                    <div className="bg-blue-500 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center border-2 border-black flex-shrink-0 text-2xl shadow-md">2</div>
                    <p className="text-lg font-bold ">
                      Pets in this category are neither lazy nor extremely energetic, example:<br />Dogs that go for daily walks and play moderately<br />Cats that spend time indoors but also run, jump, or climb occasionally. 
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-6 p-2">
                    <div className="bg-blue-500 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center border-2 border-black flex-shrink-0 text-2xl shadow-md">3</div>
                    <p className="text-lg font-bold ">
                      Pets at the high active level are typically working or hunting pets.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-6 p-2">
                    <div className="bg-blue-500 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center border-2 border-black flex-shrink-0 text-2xl shadow-md">4</div>
                    <p className="text-lg  font-bold ">
                      we use function RER (Resting Energy Requirement) to calculator.
                    </p>
                </div>

            </div>
        </div>
      </div>

      <Footer></Footer>

    </div>
  )
}

export default Home