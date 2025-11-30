import React from 'react'
import Link from 'next/link'

// const ButtonStyle : string = "block decoration-0 text-center items-center flex-1 p-3 text-black bg-white border-white border-4 border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-white hover:border-black" 

const SubMenu: string = "block decoration-0 text-center items-center flex-1 p-3 text-black bg-white border-black border-4 border-solid rounded-full cursor-pointer text-1.5xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white" 

const NavBar = () => {
  return (
    <div className="sticky top-0 z-40 transition-none box-border">
        <ul className="list-none bg-white flex w-full p-4 justify-around gap-5 items-center">
            <li><Link className="decoration-0 font-extrabold text-blue-500 text-5xl cursor-pointer" href="#">PetCare 🐾</Link></li>
            <li><Link className="commonbtn" href="/calculator">Pet feeding <br/>calculator 🍖</Link></li>            
            <li><Link className="commonbtn" href="calendar">Pet events <br/>calendar 📅</Link></li>            
            <li><Link className="commonbtn" href="tracker">Tracking pet <br/>health 📊</Link></li>
            <li className="group">
              <Link className="commonbtn" href='#'>News ▼
              </Link>
              <ul className="bg-white absolute z-50 hidden group-hover:block">
                <li><Link className={SubMenu} href="news/admin">Admin</Link></li>
                <li><Link className={SubMenu} href="news/user">User</Link></li>
                <li><Link className={SubMenu} href="news/favorite">Favorite</Link></li>
              </ul>
              
            </li>
            <li>
              <ul className="flex gap-5 justify-center">
                  <li><a href="login" className="block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white">Log in</a></li>
                  <li><a href="signin" className="block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white">Sign in</a></li>
              </ul>
            </li>
        </ul>
    </div>
  )
}

export default NavBar