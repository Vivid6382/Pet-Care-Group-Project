'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import BlueButton from '@/components/BlueButton'
import { useRouter } from 'next/navigation'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const [
    createUserWithEmailAndPassword,
    userCredential,
    loading,
    authError,
  ] = useCreateUserWithEmailAndPassword(auth)

  useEffect(() => {
    if (authError) {
      setError(authError.message)
      setLocalLoading(false)
    }
  }, [authError])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLocalLoading(true)

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

    // ✅ REQUIRED FIELD VALIDATION
    if (!trimmedUsername || !trimmedEmail || !password) {
      setError('Username, email, and password are required.')
      setLocalLoading(false)
      return
    }

    try {
      // ✅ Check username uniqueness by querying the users collection
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('username', '==', trimmedUsername), limit(1))
      const querySnap = await getDocs(q)

      if (!querySnap.empty) {
        setError(`The username "${trimmedUsername}" is already taken.`)
        setLocalLoading(false)
        return
      }

      // Create user 
      const userCredential = await createUserWithEmailAndPassword(
        trimmedEmail,
        password
      )

      if (!userCredential?.user) return

      const user = userCredential.user

      // Save user document (single source of truth)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: trimmedUsername,
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      })

      // NOTE: removed reservation document in a separate 'usernames' collection.

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/vet.png"
        alt="Pet Care Background"
        fill
        className="object-cover z-[-1]"
        priority
      />
      <div className="absolute inset-0 bg-blue-300/40 z-0"></div>

      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="w-full max-w-lg border-2 border-black rounded-xl p-12 bg-blue-200 relative">
          <Link className="flex justify-center font-extrabold text-black text-5xl mb-8 cursor-pointer" href="/">PetCare 🐾</Link>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full bg-white text-black border-4 border-black p-4 font-bold rounded-2xl outline-0"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full bg-white text-black border-4 border-black p-4 font-bold rounded-2xl outline-0"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full bg-white text-black border-4 border-black p-4 font-bold rounded-2xl outline-0"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-600 text-sm font-bold text-center">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <BlueButton type="submit" disabled={localLoading}>
                {localLoading ? 'Signing up...' : 'Sign up'}
              </BlueButton>
            </div>

            <div className="mt-4 text-center text-sm font-medium text-black">
              already have account ? log in{' '}
              <a href="/login" className="underline hover:text-blue-700">
                here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
