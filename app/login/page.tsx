'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import BlueButton from '@/components/BlueButton'
import { useRouter } from 'next/navigation'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const [
    signInWithEmailAndPassword,
    userCredential,
    loading,
    authError,
  ] = useSignInWithEmailAndPassword(auth)

  useEffect(() => {
    if (authError) {
      setError(authError.message)
      setLocalLoading(false)
    }
  }, [authError])

  useEffect(() => {
    if (userCredential) {
      // successful sign in
      router.push('/')
    }
  }, [userCredential, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLocalLoading(true)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Email and password are required.')
      setLocalLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(trimmedEmail, password)
      // redirect handled by effect above
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
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
              <p className="text-red-600 text-sm font-bold text-center">{error}</p>
            )}

            <div className="mt-6 flex justify-center">
              <BlueButton type="submit" disabled={localLoading}>
                {localLoading ? 'Logging in...' : 'Log in'}
              </BlueButton>
            </div>

            <div className="mt-4 text-center text-sm font-medium text-black">
              <div>
                don't have an account?{' '}
                <Link href="/signup" className="underline hover:text-blue-700">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
