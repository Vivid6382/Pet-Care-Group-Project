'use client'

import { useState } from 'react'
import { updateUserProfile } from './firebaseProfile'

export default function UserProfile({
  user,
  userData,
  refresh,
}: {
  user: any
  userData: any
  refresh: () => void
}) {
  const [editMode, setEditMode] = useState(false)
  const [username, setUsername] = useState(userData.username)
  const [picture, setPicture] = useState<string | null>(userData.picture || null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (saving) return
    setSaving(true)
    await updateUserProfile(user.uid, { username, picture })
    setEditMode(false)
    refresh()
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center p-6 border-4 border-black gap-2">
      {/* Avatar */}
      <div className="w-40 h-40 bg-gray-100 rounded-full border-4 overflow-hidden flex items-center justify-center">
        {userData.picture ? (
          <img
            src={userData.picture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-800 font-bold">No Image</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">
              Username
            </label>
            {editMode ? (
              <input
                className="w-full p-2 border-2 border-black rounded mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              <p className="text-2xl font-black">{userData.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">
              Email Address
            </label>
            <p className="text-lg">{userData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">
              Account Created
            </label>
            <p className="text-gray-700">
              {userData.createdAt?.toDate().toLocaleString()}
            </p>
          </div>

          {editMode && (
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-blue-800">
                Picture URL
              </label>
              <input
                className="w-full p-2 border-2 border-black rounded mt-1"
                value={picture || ''}
                onChange={(e) => setPicture(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => (editMode ? save() : setEditMode(true))}
              disabled={saving}
              className={`
                px-10 py-3 font-bold border-4 border-black rounded-full
                transition-all hover:bg-black hover:text-white
                ${saving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </button>

            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="px-10 py-3 font-bold hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
