import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React from 'react'
import Image from 'next/image'
import Addpost from '@/components/addpost'
import Setting from '@/components/setting'
import Dislike from '@/components/dislike'
import Like from '@/components/like'
import Share from '@/components/share'

const post = () => {
  return (
    <div>
        <NavBar></NavBar>
        
            <div>
            <ul className="bluewrap">
                <h1 className="text-white">Stay updated with the latest pet care tips, health news, and community stories. 🐾</h1>
            </ul>
            </div>
            <div className="bg-blue-200 relative h-screen w-full pt-6">
                <div className="m-3 flex right-5 ">
                    <Addpost />
                </div>
                <div>
                    <div className='w-full max-w-md bg-white border-2 border-black rounded-[2rem] p-6  mx-auto '>
                        <div className="flex gap-5 items-center mb-4 ">
                            <div className="flex gap-3">
                                <div><Image src="/images/profile.png" alt='avatar' width={48} height={48}>
                                </Image>
                                </div>
                            </div>
                            <div>
                            <div className='flex items-center gap-1 '>
                                <span className='font-bold text-lg leading-none' >Vucow</span>
                                <span>
                                    <Image src='/images/checklist.png' alt='tick' width={15} height={15}></Image>
                                </span>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 text-sm font-medium'>
                                <span className='leading-none'>11/30/2025</span>
                                <div>
                                   <Setting/>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div>
                            <p>this is content</p>
                        </div>
                        <div className="flex-1 overflow-hidden rounded-md">
           
                            <img 
                                src="/images/t1.png" 
                                alt="example" 
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="flex gap-2 mb-1">
                            <div>
                                <Like/>
                            </div>
                            <div>
                                <Dislike/>
                            </div>
                            <div>
                                <Share/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default post