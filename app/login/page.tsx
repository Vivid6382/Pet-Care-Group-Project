'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import BlueButton from '@/components/BlueButton'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function Login() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [localLoading, setLocalLoading] = useState(false)

    // Submit function
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLocalLoading(true)

        try {
            let loginEmail = email.trim()

            // If username is provided instead of email, look up the email
            if (username.trim() && !email.trim()) {
                // Query the users collection to find the user by username
                const usersRef = collection(db, 'users')
                const q = query(usersRef, where('username', '==', username.trim()))
                const querySnapshot = await getDocs(q)

                if (querySnapshot.empty) {
                    setError('Username not found')
                    setLocalLoading(false)
                    return
                }

                // Get the email from the user document
                const userDoc = querySnapshot.docs[0]
                loginEmail = userDoc.data().email

                if (!loginEmail) {
                    setError('This account was created without an email and cannot log in this way')
                    setLocalLoading(false)
                    return
                }
            }

            // If neither username nor email is provided
            if (!loginEmail && !username.trim()) {
                setError('Please provide either username or email')
                setLocalLoading(false)
                return
            }

            // Sign in with email and password
            await signInWithEmailAndPassword(auth, loginEmail, password)

            router.push('/')

        } catch (err: any) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email')
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address')
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid credentials. Please check your email/username and password')
            } else {
                setError(err.message || 'Something went wrong')
            }
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
                            disabled={email.trim() !== ''}
                        />

                        <div className="text-center text-sm font-bold text-black">
                            OR
                        </div>

                        <input
                            type="email"
                            className="w-full bg-white text-black border-4 border-black p-4 font-bold rounded-2xl outline-0"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={username.trim() !== ''}
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
                                {localLoading ? 'Logging in...' : 'Log in'}
                            </BlueButton>
                        </div>

                        <div className="mt-4 text-center text-sm font-medium text-black">
                            don't have an account? sign up{' '}
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