'use client';

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

// --- Định nghĩa kiểu dữ liệu ---
type PetType = 'Dog' | 'Cat';
type Gender = 'Male' | 'Female';
type FoodType = 'Gà' | 'Bò' | 'Gạo';

interface FormData {
  petType: PetType;
  gender: Gender;
  weight: number | '';
  foodType: FoodType;
  age: number | '';
  feedingAmount: number | ''; // gram/day
  waterIntake: number | '';   // ml/day
}

const SimpleLineChart = ({ data }: { data: number[] }) => {
  const height = 300;
  const width = 500;
  const padding = 40;
  const maxVal = 10; // Thang điểm BCS thường là 1-9, lấy max 10 cho đẹp

  // Tạo các điểm tọa độ cho đường line
  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - (val / maxVal) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Lưới ngang (Grid lines) */}
        {[0, 2.5, 5, 7.5, 10].map((val) => {
          const y = height - padding - (val / maxVal) * (height - 2 * padding);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={padding - 10} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
                {val}
              </text>
            </g>
          );
        })}

        {/* Trục X */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#000" strokeWidth="2" />
        
        {/* Đường biểu đồ */}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Các điểm tròn (Dots) */}
        {data.map((val, index) => {
          const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - padding - (val / maxVal) * (height - 2 * padding);
          return (
            <circle key={index} cx={x} cy={y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2">
              <title>Tháng {index + 1}: BCS {val.toFixed(1)}</title>
            </circle>
          );
        })}

        {/* Label trục X */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12" fontWeight="bold">Timeline (Months)</text>
        {/* Label trục Y */}
        <text x={10} y={height / 2} textAnchor="middle" fontSize="12" fontWeight="bold" transform={`rotate(-90, 15, ${height/2})`}>BCS Score</text>
      </svg>
    </div>
  );
};

const Tracker = () => {
  // State quản lý form
  const [formData, setFormData] = useState<FormData>({
    petType: 'Dog',
    gender: 'Male',
    foodType: 'Gà',
    age: '',
    feedingAmount: '',
    waterIntake: '',
  });

  // State quản lý dữ liệu biểu đồ (Mặc định là rỗng hoặc dữ liệu mẫu)
  const [chartData, setChartData] = useState<number[]>([5, 5, 5, 5, 5]);
  const [bcsScore, setBcsScore] = useState<number | null>(null);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'feedingAmount' || name === 'waterIntake' ? Number(value) : value
    }));
  };

  // Hàm tính toán BCS giả định
  const handleCalculate = () => {
    // Logic giả định: 
    // BCS lý tưởng là 5/9. 
    // Ăn quá nhiều (feeding) so với tiêu chuẩn sẽ tăng điểm (béo phì).
    // Tuổi tác cũng ảnh hưởng nhẹ.
    
    let baseScore = 5; // Điểm chuẩn
    
    const feed = Number(formData.feedingAmount) || 0;
    const water = Number(formData.waterIntake) || 0;
    const age = Number(formData.age) || 1;

    // Giả sử mức ăn chuẩn là 200g/ngày. Cứ dư 50g tăng 0.5 điểm BCS
    const dietImpact = (feed - 200) / 50 * 0.5;
    
    // Nước uống tốt giúp điều hòa (giả định giảm nhẹ tác động xấu)
    const hydrationFactor = water > 500 ? -0.2 : 0; 

    let calculatedBCS = baseScore + dietImpact + hydrationFactor;

    // Kẹp giá trị trong khoảng 1-9
    calculatedBCS = Math.max(1, Math.min(9, calculatedBCS));

    setBcsScore(Number(calculatedBCS.toFixed(1)));

    // Tạo dữ liệu biểu đồ mô phỏng dự đoán trong 5 tháng tới
    // Giả sử nếu không thay đổi chế độ ăn, BCS sẽ tịnh tiến theo hướng hiện tại
    const trend = [];
    for (let i = 0; i < 5; i++) {
        // Biến động nhẹ ngẫu nhiên để biểu đồ trông tự nhiên hơn
        let val = calculatedBCS + (i * 0.2 * (calculatedBCS > 5 ? 1 : -1));
        val = Math.max(1, Math.min(9, val));
        trend.push(val);
    }
    setChartData(trend);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans">
      <NavBar />

      {/* Header Section */}
      <div className="bg-blue-500 w-full py-8 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-2">Understand your pet’s wellness through data</h1>
        <p className="text-xl opacity-90">Tracker your pet’s condition using charts and insights.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-10">
        <div className="bg-blue-300 w-full max-w-6xl rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row gap-8">
          
          {/* Left Side: Form */}
          <div className="flex-1 space-y-4">
            {/* Select Pet */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <select 
                name="petType" 
                value={formData.petType}
                onChange={handleChange}
                className="w-full p-4 text-xl font-bold bg-white outline-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="Dog">Chó (Dog)</option>
                <option value="Cat">Mèo (Cat)</option>
              </select>
            </div>

            {/* Age */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden flex items-center px-4">
              <label className="font-bold text-xl min-w-[80px]">Age:</label>
              <input 
                type="number" 
                name="age" 
                placeholder="Ex: 2 (years)"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-4 text-xl font-medium outline-none"
              />
            </div>

            {/* Gender */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-4 text-xl font-bold bg-white outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Food Type */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <select 
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full p-4 text-xl font-bold bg-white outline-none cursor-pointer"
              >
                <option value="Gà">Gà (Chicken)</option>
                <option value="Bò">Bò (Beef)</option>
                <option value="Gạo">Gạo (Rice)</option>
              </select>
            </div>

            {/* Feeding Amount */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden flex flex-col p-2">
              <label className="font-bold text-lg px-2 text-gray-600">Feeding amount (g/day)</label>
              <input 
                type="number" 
                name="feedingAmount" 
                placeholder="Enter amount..."
                value={formData.feedingAmount}
                onChange={handleChange}
                className="w-full p-2 text-xl font-bold outline-none"
              />
            </div>

            {/* Water Intake */}
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden flex flex-col p-2">
              <label className="font-bold text-lg px-2 text-gray-600">Water intake (ml/day)</label>
              <input 
                type="number" 
                name="waterIntake" 
                placeholder="Enter amount..."
                value={formData.waterIntake}
                onChange={handleChange}
                className="w-full p-2 text-xl font-bold outline-none"
              />
            </div>

            {/* Calculate Button */}
            <button 
              onClick={handleCalculate}
              className="w-full bg-blue-600 text-white font-black text-2xl py-4 rounded-full border-4 border-black hover:bg-white hover:text-blue-600 transition-all shadow-lg active:translate-y-1 mt-4"
            >
              CALCULATE ➤
            </button>
          </div>

          {/* Right Side: Chart Result */}
          <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] border-4 border-white shadow-inner relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Health Condition Chart (BCS)</h2>
            
            {/* Chart Component */}
            <div className="w-full flex-1 flex items-center justify-center">
                <SimpleLineChart data={chartData} />
            </div>

            {/* Result Text */}
            {bcsScore !== null && (
                <div className="mt-4 text-center animate-bounce">
                    <p className="text-xl font-bold text-gray-500">Estimated Body Condition Score:</p>
                    <p className={`text-5xl font-black ${bcsScore > 6 || bcsScore < 4 ? 'text-red-500' : 'text-green-500'}`}>
                        {bcsScore} / 9
                    </p>
                    <p className="text-sm text-gray-400 mt-2">(5 is ideal)</p>
                </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tracker;