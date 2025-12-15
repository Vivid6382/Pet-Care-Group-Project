'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import BlueButton from '@/components/BlueButton'
import { useRouter } from 'next/navigation'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

export default function Login() {

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

          <div className="flex justify-center font-extrabold text-black text-5xl mb-8">
            PetCare 🐾
          </div>

          <form onSubmit={onSubmit} className="space-y-4">

            <input
              type="text"
              className="w-full bg-white text-black border-4 border-black p-4 font-bold rounded-2xl outline-0"
              placeholder="Email or Username"
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
              <BlueButton type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </BlueButton>
            </div>

            <div className="mt-4 text-center text-sm font-medium text-black">
              don’t have an account ? sign up{' '}
              <a href="/signup" className="underline hover:text-blue-700">
                here
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
