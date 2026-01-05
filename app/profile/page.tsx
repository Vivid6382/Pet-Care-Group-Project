'use client'

import React, { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'

import UserProfile from './UserProfile'
import PetProfile from './PetProfile'
import { listenToAuth, getUserData, getPets } from './firebaseProfile'
import { Pet } from './types'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [ready, setReady] = useState(false)

  const refresh = async (uid = user?.uid) => {
    if (!uid) return
    setUserData(await getUserData(uid))
    setPets(await getPets(uid))
  }

  useEffect(() => {
    const unsub = listenToAuth(async (u) => {
      setUser(u)
      if (!u) return setReady(true)
      await refresh(u.uid)
      setReady(true)
    })
    return unsub
  }, [])

  if (!ready) return <p>Loading...</p>
  if (!user) {
  return (
      <main>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="mb-4">You must be logged in to view your profile.</h1>
          <button className="block mx-auto w-1/2 font-bold text-2xl text-white bg-blue-500 rounded-full border-4 border-black p-3 text-center transition-all duration-200
        hover:bg-white hover:text-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => router.push('/login')}>Log in</button>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <UserProfile user={user} userData={userData} refresh={refresh} />
        <PetProfile user={user} pets={pets} refresh={refresh} />
      </main>
      <Footer />
    </div>
  )
}
