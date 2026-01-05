'use client'

import React, { useState } from 'react'
import { Pet } from './types'
import { createPet, updatePet, removePetById } from './firebaseProfile'

export default function PetProfile({
  user,
  pets,
  refresh,
}: {
  user: any
  pets: Pet[]
  refresh: () => void
}) {
  const today = () => new Date().toISOString().slice(0, 10)

  const [adding, setAdding] = useState(false)
  const [newPet, setNewPet] = useState({
    name: '',
    picture: '',
    type: 'dog',
    birthDate: today(),
  })

  const [editingPetId, setEditingPetId] = useState<string | null>(null)
  const [editedPet, setEditedPet] = useState({
    name: '',
    picture: '',
    type: 'dog',
    birthDate: today(),
  })

  // 🔒 loading guards
  const [addLoading, setAddLoading] = useState(false)
  const [savingPetId, setSavingPetId] = useState<string | null>(null)
  const [removingPetId, setRemovingPetId] = useState<string | null>(null)

  const startEditPet = (pet: Pet) => {
    setEditingPetId(pet.id)
    setEditedPet({
      name: pet.name || '',
      picture: pet.picture || '',
      type: pet.type || 'dog',
      birthDate: pet.birthDate?.toDate
        ? pet.birthDate.toDate().toISOString().slice(0, 10)
        : today(),
    })
  }

  const saveEditedPet = async (id: string) => {
    if (savingPetId === id) return
    setSavingPetId(id)

    try {
      await updatePet(user.uid, id, editedPet)
      setEditingPetId(null)
      refresh()
    } finally {
      setSavingPetId(null)
    }
  }

  const removePet = async (id: string) => {
    if (removingPetId === id) return
    if (!confirm('Remove this pet?')) return

    setRemovingPetId(id)
    try {
      await removePetById(user.uid, id)
      refresh()
    } finally {
      setRemovingPetId(null)
    }
  }

  const addPet = async () => {
    if (addLoading) return
    if (!newPet.name.trim()) {
      alert('Please enter a pet name')
      return
    }

    setAddLoading(true)
    try {
      await createPet(user.uid, newPet)
      setNewPet({ name: '', picture: '', type: 'dog', birthDate: today() })
      setAdding(false)
      refresh()
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6 border-4 border-black">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Your Pets</p>
        <button
          onClick={() => setAdding(!adding)}
          disabled={addLoading}
          className="px-4 py-2 font-bold border-4 border-black rounded-full hover:bg-black hover:text-white disabled:opacity-50"
        >
          {adding ? 'Cancel' : 'Add Pet'}
        </button>
      </div>

      {/* ADD PET */}
      {adding && (
        <div className="border-2 rounded-2xl p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-2 border-2 rounded"
            placeholder="Pet name"
            value={newPet.name}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <input
            className="p-2 border-2 rounded"
            placeholder="Picture URL"
            value={newPet.picture}
            onChange={(e) => setNewPet({ ...newPet, picture: e.target.value })}
          />
          <select
            className="p-2 border-2 rounded"
            value={newPet.type}
            onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
          <input
            type="date"
            className="p-2 border-2 rounded"
            value={newPet.birthDate}
            onChange={(e) =>
              setNewPet({ ...newPet, birthDate: e.target.value })
            }
          />

          <button
            onClick={addPet}
            disabled={addLoading}
            className="col-span-full px-4 py-2 font-bold border-2 border-black rounded-full hover:bg-black hover:text-white disabled:opacity-50"
          >
            {addLoading ? 'Creating...' : 'Create Pet'}
          </button>
        </div>
      )}

      {/* PET LIST */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="border-2 rounded-2xl p-4 flex gap-4 items-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0">
              {pet.picture ? (
                <img
                  src={pet.picture}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-bold">No Image</span>
              )}
            </div>

            <div className="flex-1">
              {editingPetId === pet.id ? (
                <div className="space-y-2">
                  <input
                    className="p-2 border-2 rounded w-full"
                    value={editedPet.name}
                    onChange={(e) =>
                      setEditedPet({ ...editedPet, name: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border-2 rounded w-full"
                    value={editedPet.picture}
                    onChange={(e) =>
                      setEditedPet({ ...editedPet, picture: e.target.value })
                    }
                  />
                  <select
                    className="p-2 border-2 rounded w-full"
                    value={editedPet.type}
                    onChange={(e) =>
                      setEditedPet({ ...editedPet, type: e.target.value })
                    }
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </select>
                  <input
                    type="date"
                    className="p-2 border-2 rounded w-full"
                    value={editedPet.birthDate}
                    onChange={(e) =>
                      setEditedPet({
                        ...editedPet,
                        birthDate: e.target.value,
                      })
                    }
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEditedPet(pet.id)}
                      disabled={savingPetId === pet.id}
                      className="px-4 py-2 font-bold border-2 border-black rounded-full hover:bg-black hover:text-white disabled:opacity-50"
                    >
                      {savingPetId === pet.id ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingPetId(null)}
                      disabled={savingPetId === pet.id}
                      className="px-4 py-2 font-bold hover:underline disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-lg">{pet.name}</p>
                  <p className="text-sm">Type: {pet.type}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEditPet(pet)}
                      disabled={savingPetId !== null}
                      className="px-4 py-2 font-bold border-2 border-black rounded-full hover:bg-black hover:text-white disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removePet(pet.id)}
                      disabled={removingPetId === pet.id}
                      className="px-4 py-2 font-bold border-2 border-black rounded-full hover:bg-black hover:text-white disabled:opacity-50"
                    >
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
  )
}
