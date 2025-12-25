import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between">
        
        {/* Brand + contact */}
        <div className="mb-6">
          <Link
            href="/"
            className="decoration-0 font-extrabold text-blue-500 text-5xl cursor-pointer"
          >
            PetCare 🐾
          </Link>
          <h2>Contact us: XXX-XXX-XXX</h2>
        </div>

        {/* Social links */}
        <nav aria-label="Footer" className="grid grid-cols-3 gap-6">
          
          <div className="flex flex-col">
            <p className="text-4xl font-bold uppercase text-black">Instagram</p>
            <a
              href="https://instagram.com/yourprofile"
              className="mt-1 block text-black hover:text-blue-500"
            >
              instagram.com/yourprofile
            </a>
          </div>

          <div className="flex flex-col">
            <p className="text-4xl font-bold uppercase text-black">Facebook</p>
            <a
              href="https://facebook.com/yourpage"
              className="mt-1 block text-black hover:text-blue-500"
            >
              facebook.com/yourpage
            </a>
          </div>

          <div className="flex flex-col">
            <p className="text-4xl font-bold uppercase text-black">YouTube</p>
            <a
              href="https://youtube.com/yourchannel"
              className="mt-1 block text-black hover:text-blue-500"
            >
              youtube.com/yourchannel
            </a>
          </div>

        </nav>
      </div>
    </footer>
  )
}

export default Footer
