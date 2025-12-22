'use client'

import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const AuthButton: string =
  "block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white"

export default function SimpleProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [username, setUsername] = useState('')
  const [picture, setPicture] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (u) fetchUserData(u.uid)
    })
    return () => unsub()
  }, [])

  const fetchUserData = async (uid: string) => {
    const docSnap = await getDoc(doc(db, 'users', uid))
    if (docSnap.exists()) {
      const data = docSnap.data()
      setUserData(data)
      setUsername(data.username)
      setPicture(data.picture || null)
    }
  }

  const saveChanges = async () => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), {
      username,
      picture,
    })
    setEditMode(false)
    fetchUserData(user.uid)
  }

  if (!userData) return <p className="p-10 text-center">Loading...</p>

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <NavBar />
      <div className='bluewrap'>
        <h1 className='text-white'>Edit your profile!</h1>
      </div>

      <main className="w-full flex items-center justify-center p-6">
        {/* Profile Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full border-4 border-black">
          
          {/* Left Section: Square Image */}
          <div className="w-full md:w-1/3 aspect-square bg-gray-200 border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-center overflow-hidden">
            {userData.picture ? (
              <img 
                src={userData.picture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-800 font-bold">No Image</span>
            )}
          </div>

          {/* Right Section: Info */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">Username</label>
                {editMode ? (
                  <input 
                    className="w-full p-2 border-2 border-black rounded mt-1"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                ) : (
                  <p className="text-2xl font-black">{userData.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">Email Address</label>
                <p className="text-lg">{userData.email}</p>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">Account Created</label>
                <p className="text-gray-700">{userData.createdAt?.toDate().toLocaleString()}</p>
              </div>

              {editMode && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">Picture URL</label>
                  <input 
                    type="text" 
                    placeholder="https://image-url.com" 
                    className="w-full p-2 border-2 border-black rounded mt-1"
                    value={picture || ''} 
                    onChange={(e) => setPicture(e.target.value)} 
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    if(editMode) saveChanges()
                    else setEditMode(true)
                  }} 
                  className={AuthButton}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </button>
                
                {editMode && (
                  <button 
                    onClick={() => setEditMode(false)} 
                    className="px-10 py-3 font-bold hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}