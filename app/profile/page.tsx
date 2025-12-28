'use client'

import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import BlueButton from '@/components/buttons/BlueButton'
import { useRouter } from 'next/navigation'

type Pet = {
  id: string // hidden id used as document name
  name: string
  picture?: string | null
  type: 'dog' | 'cat'
  birthDate?: any // Firestore Timestamp in storage
}

export default function Profile() {
  //helpers 
  const router = useRouter()
  const todayString = () => new Date().toISOString()
  //user variables
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false) 
  const [userData, setUserData] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [username, setUsername] = useState('')
  const [picture, setPicture] = useState<string | null>(null)
  // pet variables
  const [pets, setPets] = useState<Pet[]>([])
  const [adding, setAdding] = useState(false)
  const [newPet, setNewPet] = useState({ name: '', picture: '', type: 'dog', birthDate: todayString() })
  const [editingPetId, setEditingPetId] = useState<string | null>(null)
  const [editedPet, setEditedPet] = useState({ name: '', picture: '', type: 'dog', birthDate: todayString() })
  // loading state booleans
  const [addLoading, setAddLoading] = useState(false) // creating a pet
  const [savingProfile, setSavingProfile] = useState(false) // saving profile changes
  const [savingPetId, setSavingPetId] = useState<string | null>(null) // id of pet currently being saved
  const [removingPetId, setRemovingPetId] = useState<string | null>(null) // id of pet being removed

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthChecked(true)          // mark that auth has been checked
      if (u) fetchUserData(u.uid)
      else {
        setUserData(null)           // ensure userData is cleared when logged out
      }
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
    await fetchPets(uid)
  }

  const saveChanges = async () => {
    if (!user) return
    if (savingProfile) return // 🛑 NEW: guard against spam clicks

    setSavingProfile(true) // 🔒 NEW: lock button
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username,
        picture,
      })
      setEditMode(false)
      fetchUserData(user.uid)
    } catch (e) {
      console.error(e)
      alert('Failed to save profile')
    } finally {
      setSavingProfile(false) // 🔓 NEW: unlock button
    }
  }

  const fetchPets = async (uid: string) => {
    const petsCol = collection(db, 'users', uid, 'pets')
    const snaps = await getDocs(petsCol)
    const list: Pet[] = snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    // sort by numeric id ascending
    list.sort((a, b) => Number(a.id) - Number(b.id))
    setPets(list)
  }

  // Add pet: uses a transaction to increment petCounter on user doc and create a pet doc named with the new counter
  const addPet = async () => {
    if (!user) return
    if (addLoading) return // 🛑 NEW: prevent double submit
    if (!newPet.name.trim()) return alert('Please enter a pet name')

    setAddLoading(true) // 🔒 NEW: lock Create Pet button

    try {
      await runTransaction(db, async (t) => {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await t.get(userRef)
        if (!userSnap.exists()) throw new Error('User doc missing')

        const current = (userSnap.data() as any).petCounter || 0
        const next = current + 1

        t.update(userRef, { petCounter: next })

        const petRef = doc(db, 'users', user.uid, 'pets', String(next))
        t.set(petRef, {
          name: newPet.name.trim(),
          picture: newPet.picture || null,
          type: newPet.type,
          birthDate: Timestamp.fromDate(new Date(newPet.birthDate)),
        })
      })

      setNewPet({ name: '', picture: '', type: 'dog', birthDate: todayString() })
      setAdding(false)
      fetchPets(user.uid)

    } catch (e) {
      console.error(e)
      alert('Failed to add pet')
    } finally {
      setAddLoading(false) // 🔓 NEW: unlock button
    }
  }


  const startEditPet = (pet: Pet) => {
    setEditingPetId(pet.id)
    setEditedPet({
      name: pet.name || '',
      picture: pet.picture || '',
      type: pet.type || 'dog',
      birthDate: pet.birthDate ? (pet.birthDate.toDate ? pet.birthDate.toDate().toISOString().slice(0, 10) : pet.birthDate) : todayString(),
    })
  }

  const saveEditedPet = async (id: string) => {
    if (!user) return
    if (savingPetId === id) return // 🛑 NEW: block double-save

    setSavingPetId(id) // 🔒 NEW: lock only THIS pet

    try {
      await updateDoc(doc(db, 'users', user.uid, 'pets', id), {
        name: editedPet.name,
        picture: editedPet.picture || null,
        type: editedPet.type,
        birthDate: Timestamp.fromDate(new Date(editedPet.birthDate)),
      })

      setEditingPetId(null)
      fetchPets(user.uid)

    } catch (e) {
      console.error(e)
      alert('Failed to save pet')
    } finally {
      setSavingPetId(null) // 🔓 NEW
    }
  }


  const cancelEditPet = () => {
    setEditingPetId(null)
  }

  const removePet = async (id?: string) => {
    if (!user || !id) return
    if (removingPetId === id) return // 🛑 NEW
    if (!confirm('Remove this pet?')) return

    setRemovingPetId(id) // 🔒 NEW

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'pets', id))
      fetchPets(user.uid)
    } catch (e) {
      console.error(e)
      alert('Failed to remove pet')
    } finally {
      setRemovingPetId(null) // 🔓 NEW
    }
  }

  if (!authChecked) return <p className="p-10 text-center">Loading...</p>

  if (!user) {
    return (
      <main>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="mb-4">You must be logged in to view your profile.</h1>
          <BlueButton onClick={() => router.push('/login')}>Log in</BlueButton>
        </div>
      </main>
    )
  }

  // now safe to assume user exists and userData will be rendered (you may still want to guard userData)
  if (!userData) return <p className="p-10 text-center">Loading profile data...</p>

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <NavBar />
      <div className='bluewrap'>
        <h1 className='text-white'>Edit your profile!</h1>
      </div>

      <main className="w-full flex items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center p-6 border-4 border-black gap-2">
            <div className="w-40 h-40 bg-gray-100 rounded-full border-4 overflow-hidden flex items-center justify-center gap-4">
              {userData.picture ? (
                <img src={userData.picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-800 font-bold">No Image</span>
              )}
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">Username</label>
                  {editMode ? (
                    <input className="w-full p-2 border-2 border-black rounded mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
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
                    <input type="text" placeholder="https://image-url.com" className="w-full p-2 border-2 border-black rounded mt-1" value={picture || ''} onChange={(e) => setPicture(e.target.value)} />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => { if (editMode) saveChanges(); else setEditMode(true) }}
                  disabled={savingProfile}
                  className={`block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white ${savingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </button>

                  {editMode && (
                    <button onClick={() => setEditMode(false)} className="px-10 py-3 font-bold hover:underline">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pets Section */}
          <section className="bg-white rounded-2xl shadow p-6 border-4 border-black">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">Your Pets</p>
              <div className="flex gap-2">
                <button onClick={() => setAdding(!adding)} className="block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white">{adding ? 'Cancel' : 'Add Pet'}</button>
              </div>
            </div>

            {adding && (
              <div className="border-2 rounded-2xl p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Pet name" value={newPet.name} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} className="p-2 border-2 rounded" />
                <input placeholder="Picture URL" value={newPet.picture} onChange={(e) => setNewPet({ ...newPet, picture: e.target.value })} className="p-2 border-2 rounded" />
                <select value={newPet.type} onChange={(e) => setNewPet({ ...newPet, type: e.target.value })} className="p-2 border-2 rounded">
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
                <input type="date" value={newPet.birthDate} onChange={(e) => setNewPet({ ...newPet, birthDate: e.target.value })} className="p-2 border-2 rounded" />
                <div className="col-span-full flex gap-2">
                  <button
                    onClick={addPet}
                    disabled={addLoading}
                    className={`
                      block decoration-0 px-10 py-3 text-center items-center
                      text-black bg-white border-2 border-black border-solid
                      rounded-full cursor-pointer text-1xl font-bold box-border
                      transition-all duration-200 ease-in-out
                      hover:bg-black hover:text-white
                      ${addLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {addLoading ? 'Creating...' : 'Create Pet'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.length === 0 && <p className="text-gray-600">No pets yet. Add one!</p>}

              {pets.map((pet) => (
                <div key={pet.id} className="border-2 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-22 h-22 bg-gray-100 rounded-full border-2 overflow-hidden flex items-center justify-center">
                    {pet.picture ? (
                      // @ts-ignore
                      <img src={pet.picture} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-800 font-bold">No Image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    {editingPetId === pet.id ? (
                      <div className="space-y-2">
                        <input value={editedPet.name} onChange={(e) => setEditedPet({ ...editedPet, name: e.target.value })} className="p-2 border-2 rounded w-full" />
                        <input value={editedPet.picture} onChange={(e) => setEditedPet({ ...editedPet, picture: e.target.value })} className="p-2 border-2 rounded w-full" />
                        <select value={editedPet.type} onChange={(e) => setEditedPet({ ...editedPet, type: e.target.value })} className="p-2 border-2 rounded w-full">
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                        </select>
                        <input type="date" value={editedPet.birthDate} onChange={(e) => setEditedPet({ ...editedPet, birthDate: e.target.value })} className="p-2 border-2 rounded w-full" />

                        <div className="flex gap-2">
                          <button onClick={() => saveEditedPet(pet.id)} 
                          disabled={savingPetId === pet.id}
                          className={`block decoration-0 px-10 py-3 text-center items-center text-black bg-white 2 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white ${savingPetId === pet.id ? 'opacity-50 cursor-not-allowed' : ''}`}>Save</button>
                          <button onClick={cancelEditPet} className="px-10 py-3 font-bold hover:underline">
                            {savingPetId === pet.id ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-lg">{pet.name}</p>
                        <p className="text-sm">Type: {pet.type}</p>
                        <p className="text-sm">Birth date: {pet.birthDate?.toDate ? pet.birthDate.toDate().toLocaleDateString() : pet.birthDate || '—'}</p>

                        <div className="flex gap-2 mt-2">
                          <button onClick={() => startEditPet(pet)} className="block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-2 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white">Edit</button>
                          <button onClick={() => removePet(pet.id)} 
                          disabled={removingPetId === pet.id}
                          className={`block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-2 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-black hover:text-white ${removingPetId === pet.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {removingPetId === pet.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
