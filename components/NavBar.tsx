'use client'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db} from '@/app/firebase'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const SubMenu: string =
  "block decoration-0 text-center items-center flex-1 p-3 text-black bg-white border-black border-4 border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white"
const AuthButton: string = 
  "block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white"

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])


  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (currentUser && !currentUser.isAnonymous) {
        await fetchUsername(currentUser.uid)
      } else {
        setUsername(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔎 Fetch username from Firestore
  const fetchUsername = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'usernames'),
        where('uid', '==', uid)
      )

      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        setUsername(snapshot.docs[0].data().username)
      } else {
        setUsername(null)
      }
    } catch (error) {
      console.error('Error fetching username:', error)
      setUsername(null)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUsername(null)
  }
  return (
    <div className="sticky top-0 z-40 transition-none box-border">
        <ul className="list-none bg-white flex w-full p-4 justify-around gap-5 items-center">
            <li><Link className="decoration-0 font-extrabold text-blue-500 text-5xl cursor-pointer" href="/">PetCare 🐾</Link></li>
            <li><Link className="commonbtn" href="/calculator">Pet feeding <br/>calculator 🍖</Link></li>            
            <li><Link className="commonbtn" href="/calendar">Pet events <br/>calendar 📅</Link></li>            
            <li><Link className="commonbtn" href="/tracker">Tracking pet <br/>health 📊</Link></li>
            <li className="group">
              <Link className="commonbtn" href='#'>News ▼
              </Link>
              <ul className="bg-white absolute z-50 hidden group-hover:block">
                <li><Link className={SubMenu} href="/news/admin">Admin</Link></li>
                <li><Link className={SubMenu} href="/news/user">User</Link></li>
                <li><Link className={SubMenu} href="/news/favorite">Favorite</Link></li>
              </ul>
              
            </li>
            <li>
              <ul className="flex gap-4 justify-center">
              {loading ? (
                // Show a loading indicator while the auth state is being determined
                <li className="font-bold">Loading...</li>
              ) : !user ? (
                // User is NOT logged in
                <>
                  <li><Link href="/login" className={AuthButton}>Log in</Link></li>
                  <li><Link href="/signup" className={AuthButton}>Sign up</Link></li>
                </>
              ) : (
                // User IS logged in
                <>
                  <li className={AuthButton}>
                    {user.isAnonymous ? 'Guest' : (username ?? user.email)}
                  </li>
                  <li>
                    <button onClick={handleLogout} className={AuthButton}>
                      Log out
                    </button>
                  </li>
                </>
              )}
              </ul>
            </li>
        </ul>
    </div>
  )
}

export default NavBar