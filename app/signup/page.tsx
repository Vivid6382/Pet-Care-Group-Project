'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import BlueButton from '@/components/BlueButton'
import { useRouter } from 'next/navigation'
import {
  useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth'
import { signInAnonymously } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'

export default function SignUp() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [
        createUserWithEmailAndPassword,
        _,
        loading,
    ] = useCreateUserWithEmailAndPassword(auth)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        //check if username existed
        try {
            const usernameDocRef = doc(db, 'users', username.trim())
            const docSnap = await getDoc(usernameDocRef)

            if (docSnap.exists()) {
                setError(`The username "${username.trim()}" is already taken.`)
                return // 🛑 Stop the function if username exists
            }
        } catch (err: any) {
             // Handle potential errors during the Firestore read check
            setError(`Failed to check username availability: ${err.message}`)
            return 
        }
        //check otherwise
        try {
        let userCredential

        // 🔹 Email provided → normal signup
        if (email.trim()) {
            userCredential = await createUserWithEmailAndPassword(
            email,
            password
            )
        } 
        // 🔹 No email → anonymous signup
        else {
            userCredential = await signInAnonymously(auth)
        }

        if (!userCredential?.user) return

        const user = userCredential.user

        // 🔹 Save user to Firestore
        await setDoc(doc(db, 'users', username), {
            uid: user.uid,
            username,
            email: email || null,
            isAnonymous: user.isAnonymous,
            createdAt: serverTimestamp(),
        })

        router.push('/')

        } catch (err: any) {
        setError(err.message || 'Something went wrong')
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

            <div className="flex justify-center font-extrabold text-black text-5xl mb-8">
                PetCare 🐾
            </div>

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
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                <BlueButton type="submit">
                    {loading ? 'Signing up...' : 'Sign up'}
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
