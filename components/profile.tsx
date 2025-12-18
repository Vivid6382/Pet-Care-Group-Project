"use client";

import React, { useState } from 'react';

// TypeScript interfaces
interface UserProfile {
  id: string;
  name: string;
  picture: string;
  createdAt: string;
  email: string;
}

interface PetProfile {
  id: string;
  name: string;
  picture: string;
  dob: string;
  type: string;
  // Đã xóa trường size
}

const PetWeightTracker: React.FC = () => {
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [showPetModal, setShowPetModal] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    picture: '',
    createdAt: '2023-01-15',
    email: 'johndoe@example.com',
  });

  const [pets, setPets] = useState<PetProfile[]>([
    {
      id: '1',
      name: 'Max',
      picture: '',
      dob: '2020-03-10',
      type: 'Dog',
    },
    {
      id: '2',
      name: 'Luna',
      picture: '',
      dob: '2021-07-22',
      type: 'Cat',
    },
  ]);

  const [newPet, setNewPet] = useState<PetProfile>({
    id: '',
    name: '',
    picture: '',
    dob: '',
    type: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isUser: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isUser) {
          setUserProfile({ ...userProfile, picture: result });
        } else {
          setNewPet({ ...newPet, picture: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPet = () => {
    if (newPet.name && newPet.type) {
      setPets([...pets, { ...newPet, id: Date.now().toString() }]);
      // Reset form (đã xóa size)
      setNewPet({ id: '', name: '', picture: '', dob: '', type: '' });
      setShowPetModal(false);
    }
  };

  const handleDeletePet = (petId: string) => {
    setPets(pets.filter(pet => pet.id !== petId));
  };

  const openPetModal = () => {
    // Reset form (đã xóa size)
    setNewPet({ id: '', name: '', picture: '', dob: '', type: '' });
    setShowPetModal(true);
  };

  const toggleUserEditMode = () => {
    setIsEditingUser(!isEditingUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-blue-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          
          {/* User Profile Section */}
          <div className="bg-gradient-to-br bg-blue-100 rounded-2xl p-8 shadow-lg border border-indigo-100 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <p className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">👱🏼</span>
                Your Profile
              </p>
              
              <button
                onClick={toggleUserEditMode}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold border-2 transition-all duration-200 ${
                  isEditingUser 
                    ? "bg-green-500 text-white border-green-600 hover:bg-green-600" 
                    : "bg-white text-black border-black hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
                }`}
              >
                {isEditingUser ? (
                  <>
                    <span>✔️</span> Save Profile
                  </>
                ) : (
                  <>
                    <span>✏️</span> Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8 bg-white p-8 rounded-xl shadow-md">
              <div className="relative group mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  {userProfile.picture ? (
                    <img src={userProfile.picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">👱🏼</span>
                  )}
                </div>
                
                {isEditingUser && (
                  <label className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors shadow-md border-2 border-white flex items-center justify-center">
                    <span className="text-xl leading-none">📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="w-full">
                    {isEditingUser ? (
                        <div>
                             <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</label>
                             <input 
                                type="text" 
                                value={userProfile.name}
                                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                                className="text-3xl font-bold text-gray-800 w-full border-b-2 border-indigo-300 focus:border-indigo-600 outline-none bg-transparent px-1 py-1"
                                placeholder="Enter your name"
                             />
                        </div>
                    ) : (
                        <h3 className="text-3xl font-bold text-gray-800 py-1 border-b-2 border-transparent">{userProfile.name}</h3>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isEditingUser ? 'bg-indigo-100 border border-indigo-200' : 'bg-indigo-50'}`}>
                    <span className="text-2xl">📅</span>
                    <div className="w-full">
                      <p className="text-xs text-gray-500 font-medium">Account Created</p>
                      {isEditingUser ? (
                          <input 
                            type="date"
                            value={userProfile.createdAt}
                            onChange={(e) => setUserProfile({...userProfile, createdAt: e.target.value})}
                            className="text-sm font-semibold bg-transparent w-full outline-none text-gray-800"
                          />
                      ) : (
                          <p className="text-sm font-semibold text-gray-700">
                             {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US') : 'N/A'}
                          </p>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isEditingUser ? 'bg-purple-100 border border-purple-200' : 'bg-purple-50'}`}>
                    <span className="text-2xl">📧</span>
                    <div className="w-full">
                      <p className="text-xs text-gray-500 font-medium">Email Address</p>
                      {isEditingUser ? (
                          <input 
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                            className="text-sm font-semibold bg-transparent w-full outline-none text-gray-800"
                            placeholder="name@example.com"
                          />
                      ) : (
                          <p className="text-sm font-semibold text-gray-700">{userProfile.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pets Section */}
          <div className="bg-gradient-to-br bg-blue-100 rounded-2xl p-8 shadow-lg border border-pink-100">
            <div className="flex items-start justify-between mb-6">
              <p className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">🐾</span>
                My Pets
              </p>
              <button
                onClick={openPetModal}
                className="decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white flex"
              >
                Add Pet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-[1.02]">
                  <div className="flex items-start gap-5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                      {pet.picture ? (
                        <img src={pet.picture} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">🐾</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-800 mb-3">{pet.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
                          <span>❤️</span>
                          <span className="font-medium">Type: {pet.type}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                          <span>📅</span>
                          <span className="font-medium">Birthday: {pet.dob ? new Date(pet.dob).toLocaleDateString('en-US') : 'Not updated'}</span>
                        </div>
                        {/* Phần hiển thị Size đã được xóa */}
                      </div>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium w-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pets.length === 0 && (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl">
                <div className="text-6xl mb-4">🐾</div>
                <p className="text-xl font-medium">No pets yet. Click "Add Pet" to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Pet Modal */}
      {showPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span>🐾</span>
                Add New Pet
              </h3>
              <button
                onClick={() => setShowPetModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors flex items-center justify-center"
              >
                <span>❌</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center overflow-hidden border-4 border-pink-200 shadow-lg">
                    {newPet.picture ? (
                      <img src={newPet.picture} alt="Pet" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">🐾</span>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-pink-500 p-3 rounded-full cursor-pointer hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center">
                    <span className="text-xl leading-none">📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Grid đã xóa phần nhập Size */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Name</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="e.g., Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="e.g., Dog, Cat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={newPet.dob}
                    onChange={(e) => setNewPet({ ...newPet, dob: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddPet}
                  className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Add Pet
                </button>
                <button
                  onClick={() => setShowPetModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetWeightTracker;