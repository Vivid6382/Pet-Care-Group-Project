"use client"; // This is the crucial line making it a Client Component

import React, { useState } from 'react';
import { Camera, Plus, User, Calendar, Heart, Ruler, PawPrint, X } from 'lucide-react';

// TypeScript interfaces
interface UserProfile {
  id: string;
  name: string;
  picture: string;
  dob: string;
  sex: string;
}

interface PetProfile {
  id: string;
  name: string;
  picture: string;
  dob: string;
  size: string;
  type: string;
}

const PetWeightTracker: React.FC = () => {
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showPetModal, setShowPetModal] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    picture: '',
    dob: '1990-05-15',
    sex: 'Male',
  });

  const [pets, setPets] = useState<PetProfile[]>([
    {
      id: '1',
      name: 'Max',
      picture: '',
      dob: '2020-03-10',
      size: 'Medium',
      type: 'Dog',
    },
    {
      id: '2',
      name: 'Luna',
      picture: '',
      dob: '2021-07-22',
      size: 'Small',
      type: 'Cat',
    },
  ]);

  const [newPet, setNewPet] = useState<PetProfile>({
    id: '',
    name: '',
    picture: '',
    dob: '',
    size: '',
    type: '',
  });

  const [tempUserProfile, setTempUserProfile] = useState<UserProfile>(userProfile);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isUser: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isUser) {
          setTempUserProfile({ ...tempUserProfile, picture: result });
        } else {
          setNewPet({ ...newPet, picture: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUserProfile = () => {
    setUserProfile(tempUserProfile);
    setShowUserModal(false);
  };

  const handleAddPet = () => {
    if (newPet.name && newPet.type) {
      setPets([...pets, { ...newPet, id: Date.now().toString() }]);
      setNewPet({ id: '', name: '', picture: '', dob: '', size: '', type: '' });
      setShowPetModal(false);
    }
  };

  const handleDeletePet = (petId: string) => {
    setPets(pets.filter(pet => pet.id !== petId));
  };

  const openUserModal = () => {
    setTempUserProfile(userProfile);
    setShowUserModal(true);
  };

  const openPetModal = () => {
    setNewPet({ id: '', name: '', picture: '', dob: '', size: '', type: '' });
    setShowPetModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-blue-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="bg-gradient-to-br bg-blue-100 rounded-2xl p-8 shadow-lg border border-indigo-100">
            <div className="flex items-start justify-between mb-6">
              <p className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <User className="w-8 h-8" />
                Your Profile
              </p>
              <button
                onClick={openUserModal}
                className="block decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-indigo-500 hover:text-white"
              >
                Edit Profile
              </button>
            </div>

            <div className="flex items-start gap-6 bg-white p-8 rounded-xl shadow-md">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                {userProfile.picture ? (
                  <img src={userProfile.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-indigo-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{userProfile.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-600 bg-indigo-50 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                      <p className="text-sm font-semibold">{new Date(userProfile.dob).toLocaleDateString('en-US')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 bg-purple-50 p-3 rounded-lg">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Gender</p>
                      <p className="text-sm font-semibold">{userProfile.sex}</p>
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
                <PawPrint className="w-8 h-8" />
                My Pets
              </p>
              <button
                onClick={openPetModal}
                className="decoration-0 px-10 py-3 text-center items-center text-black bg-white border-4 border-black border-solid rounded-full cursor-pointer text-1xl font-bold box-border transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white flex"
              >
                <Plus className="w-5 h-5" />
                Add Pet
              </button>
            </div>

            {/* Pets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:scale-[1.02]">
                  <div className="flex items-start gap-5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                      {pet.picture ? (
                        <img src={pet.picture} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <PawPrint className="w-12 h-12 text-pink-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-800 mb-3">{pet.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="font-medium">Type: {pet.type}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Birthday: {pet.dob ? new Date(pet.dob).toLocaleDateString('en-US') : 'Not updated'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                          <Ruler className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">Size: {pet.size}</span>
                        </div>
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
                <PawPrint className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium">No pets yet. Click "Add Pet" to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Edit Profile
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center overflow-hidden border-4 border-indigo-200 shadow-lg">
                    {tempUserProfile.picture ? (
                      <img src={tempUserProfile.picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-20 h-20 text-indigo-400" />
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-indigo-500 p-3 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={tempUserProfile.name}
                    onChange={(e) => setTempUserProfile({ ...tempUserProfile, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={tempUserProfile.dob}
                    onChange={(e) => setTempUserProfile({ ...tempUserProfile, dob: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    value={tempUserProfile.sex}
                    onChange={(e) => setTempUserProfile({ ...tempUserProfile, sex: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveUserProfile}
                  className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {showPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <PawPrint className="w-6 h-6" />
                Add New Pet
              </h3>
              <button
                onClick={() => setShowPetModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center overflow-hidden border-4 border-pink-200 shadow-lg">
                    {newPet.picture ? (
                      <img src={newPet.picture} alt="Pet" className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="w-20 h-20 text-pink-400" />
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-pink-500 p-3 rounded-full cursor-pointer hover:bg-pink-600 transition-colors shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                  <select
                    value={newPet.size}
                    onChange={(e) => setNewPet({ ...newPet, size: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
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