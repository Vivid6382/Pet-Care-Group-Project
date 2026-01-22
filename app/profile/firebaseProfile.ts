import { auth, db } from '../firebase'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
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

/**
 * Get pets ordered by createdAt.
 * Each returned pet includes the auto-generated doc id as `id`.
 */
export const getPets = async (uid: string): Promise<Pet[]> => {
  const q = query(
    collection(db, 'users', uid, 'pets'),
    orderBy('createdAt', 'asc')
  )
  const snaps = await getDocs(q)
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
}

/**
 * Create a pet using Firestore auto-generated document ID.
 * Returns the new doc id.
 */
export const createPet = async (
  uid: string,
  pet: { name: string; picture?: string; type: string; birthDate: string }
) => {
  const docRef = await addDoc(collection(db, 'users', uid, 'pets'), {
    name: pet.name,
    picture: pet.picture || null,
    type: pet.type,
    birthDate: Timestamp.fromDate(new Date(pet.birthDate)),
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export const updatePet = async (
  uid: string,
  id: string,
  pet: any
) => {
  await updateDoc(doc(db, 'users', uid, 'pets', id), {
    ...pet,
    birthDate: Timestamp.fromDate(new Date(pet.birthDate)),
    updatedAt: serverTimestamp(),
  })
}

export const removePetById = async (uid: string, id: string) => {
  await deleteDoc(doc(db, 'users', uid, 'pets', id))
}
