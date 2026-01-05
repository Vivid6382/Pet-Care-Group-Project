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
import { onAuthStateChanged } from 'firebase/auth'
import { Pet } from './types'

export const listenToAuth = (cb: (u: any) => void) =>
  onAuthStateChanged(auth, cb)

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export const updateUserProfile = async (
  uid: string,
  data: { username: string; picture: string | null }
) => {
  await updateDoc(doc(db, 'users', uid), data)
}

export const getPets = async (uid: string): Promise<Pet[]> => {
  const snaps = await getDocs(collection(db, 'users', uid, 'pets'))
  const list = snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  return list.sort((a, b) => Number(a.id) - Number(b.id))
}

export const createPet = async (
  uid: string,
  pet: { name: string; picture?: string; type: string; birthDate: string }
) => {
  await runTransaction(db, async (t) => {
    const userRef = doc(db, 'users', uid)
    const snap = await t.get(userRef)
    const next = ((snap.data() as any)?.petCounter || 0) + 1

    t.update(userRef, { petCounter: next })
    t.set(doc(db, 'users', uid, 'pets', String(next)), {
      name: pet.name,
      picture: pet.picture || null,
      type: pet.type,
      birthDate: Timestamp.fromDate(new Date(pet.birthDate)),
    })
  })
}

export const updatePet = async (
  uid: string,
  id: string,
  pet: any
) => {
  await updateDoc(doc(db, 'users', uid, 'pets', id), {
    ...pet,
    birthDate: Timestamp.fromDate(new Date(pet.birthDate)),
  })
}

export const removePetById = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'pets', id))
}
