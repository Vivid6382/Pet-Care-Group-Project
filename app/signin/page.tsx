import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import Sub1 from '@/components/sub1';


    export default function LoginPage() {
  return (
    <main className='relative h-screen w-full overflow-hidden'>
          <Image
            src="/images/vet.png" 
            alt="Pet Care Background"
            fill 
            className="object-cover z-[-1]" 
            priority 
          />
          <div className="absolute inset-0 bg-blue-300/40 z-0"></div>
    <div className="min-h-screen  flex items-center justify-center font-sans">
        <div className="w-full max-w-lg border-2 border-black rounded-xl p-12 bg-blue-200 relative">
        <div 
        
            className="flex justify-center items-center decoration-0 font-extrabold text-black text-5xl mb-8"
        >
            PetCare 🐾
        </div>
    
            <form>
                <div className='flex justify-center items-center relative w-full'>
                    <label htmlFor='username' 
                    className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase">Username</label>
                    <input type="text"  
                    className='w-full border border-balck rounded-md px-3 pt-6 pb-2 text-sm focus:outline-50px focus:border-black bg-white' 
                    required/>
                </div>
            
                <div className='flex justify-center items-center relative w-full'>
                    <label htmlFor='password'
                    className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase">password</label>
                    <input type="password"
                    className='w-full border border-balck rounded-md px-3 pt-6 pb-2 text-sm focus:outline-50px focus:border-black bg-white'
                    required/>
                </div>
            <div className='flex justify-center items-center relative w-full'>
                    <label htmlFor='password'
                    className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase">confirmation password</label>
                    <input type="password"
                    className='w-full border border-balck rounded-md px-3 pt-6 pb-2 text-sm focus:outline-50px focus:border-black bg-white'
                    required/>
                </div>
            
                <div className="mt-6 flex justify-center">
                    <Sub1 />
                </div>
                <div className="mt-4 text-center text-sm font-medium text-black">
                    <span>already have account ? log in </span>
                    <a href="/login" className="underline hover:text-blue-700">here</a>
                </div>
            
            </form>
        </div>
    </div>
    </main>
  );
}