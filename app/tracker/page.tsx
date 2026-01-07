"use client";
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PetHealthTracker() {
  const [profileData, setProfileData] = useState<Record<number, Array<{date: string; weight: number; foodIntake: number; bcs: number}>>>({
    1: [ // Max (Dog)
      { date: '2024-12-16', weight: 12.5, foodIntake: 850, bcs: 5 },
      { date: '2024-12-17', weight: 12.6, foodIntake: 920, bcs: 5 },
      { date: '2024-12-18', weight: 12.5, foodIntake: 780, bcs: 5 },
      { date: '2024-12-19', weight: 12.7, foodIntake: 950, bcs: 5 },
      { date: '2024-12-20', weight: 12.6, foodIntake: 880, bcs: 5 },
      { date: '2024-12-21', weight: 12.8, foodIntake: 900, bcs: 6 },
      { date: '2024-12-22', weight: 12.7, foodIntake: 870, bcs: 5 },
    ],
    2: [ // Luna (Cat)
      { date: '2024-12-15', weight: 4.2, foodIntake: 220, bcs: 4 },
      { date: '2024-12-16', weight: 4.3, foodIntake: 235, bcs: 4 },
      { date: '2024-12-17', weight: 4.3, foodIntake: 225, bcs: 4 },
      { date: '2024-12-18', weight: 4.4, foodIntake: 250, bcs: 5 },
      { date: '2024-12-19', weight: 4.4, foodIntake: 240, bcs: 5 },
      { date: '2024-12-20', weight: 4.5, foodIntake: 260, bcs: 5 },
    ],
    3: [ // Charlie (Dog)
      { date: '2024-12-18', weight: 25.3, foodIntake: 1500, bcs: 6 },
      { date: '2024-12-19', weight: 25.5, foodIntake: 1450, bcs: 6 },
      { date: '2024-12-20', weight: 25.4, foodIntake: 1480, bcs: 6 },
      { date: '2024-12-21', weight: 25.6, foodIntake: 1420, bcs: 6 },
      { date: '2024-12-22', weight: 25.5, foodIntake: 1400, bcs: 6 },
    ],
  });

  const [profiles] = useState([
    { id: 1, name: 'Max', species: 'Dog' },
    { id: 2, name: 'Luna', species: 'Cat' },
    { id: 3, name: 'Charlie', species: 'Dog' },
  ]);
  
  const [currentProfile, setCurrentProfile] = useState(profiles[0]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBCSGuide, setShowBCSGuide] = useState(false);

  const entries = profileData[currentProfile.id] || [];

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    foodIntake: '',
    bcs: 5,
  });

  const addEntry = () => {
    if (newEntry.date && newEntry.weight && newEntry.foodIntake) {
      const updatedEntries = [...entries, { 
        ...newEntry, 
        weight: parseFloat(newEntry.weight),
        foodIntake: parseFloat(newEntry.foodIntake)
      }].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setProfileData({
        ...profileData,
        [currentProfile.id]: updatedEntries
      });
      
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        foodIntake: '',
        bcs: 5,
      });
    }
  };

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setProfileData({
      ...profileData,
      [currentProfile.id]: updatedEntries
    });
  };

  return (
  <div>   
    <NavBar />
    <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white text-center'>Understand your pet's  <br /> wellness through data</h1></li>
        </ul>
      </div>
      
    <div className="flex flex-col w-full h-full justify-center items-center bg-blue-100 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay py-5 gap-5">
      
      <p className='block w-2/5 mx-auto font-bold text-4xl text-black bg-white border-black border-4 rounded-full p-3  text-center'>Tracking your pet's condition using charts and insights</p>
      {showBCSGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowBCSGuide(false)}>
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Body Condition Score Guide</h2>
              <button
                onClick={() => setShowBCSGuide(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <img 
                src={currentProfile.species === 'Cat' ? '/images/Cat_BCS.png' : '/images/Dog_BCS.png'}
                alt={`${currentProfile.species} Body Condition Score Guide`}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23f3f4f6"/><text x="400" y="200" text-anchor="middle" fill="%236b7280" font-size="20">Image not found</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🐾 Pet Health Tracker</h1>
              <p className="text-gray-600">Monitor your pet's daily health metrics</p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
              >
                <span className="text-2xl">👤</span>
                <div className="text-left">
                  <div className="text-sm opacity-90">Current Pet</div>
                  <div className="font-bold">{currentProfile.name} ({currentProfile.species})</div>
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Switch Profile</div>
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setCurrentProfile(profile);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                          currentProfile.id === profile.id
                            ? 'bg-purple-100 text-purple-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-gray-500">{profile.species}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add Daily Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                  placeholder="12.5"
                  className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Food Intake (cal/day)</label>
                <input
                  type="number"
                  step="1"
                  value={newEntry.foodIntake}
                  onChange={(e) => setNewEntry({ ...newEntry, foodIntake: e.target.value })}
                  placeholder="850"
                  className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  BCS (1-9)
                  <button
                    onClick={() => setShowBCSGuide(!showBCSGuide)}
                    className="text-white hover:text-yellow-200 text-lg font-bold"
                    type="button"
                  >
                    ❓
                  </button>
                </label>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={newEntry.bcs}
                  onChange={(e) => setNewEntry({ ...newEntry, bcs: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-white text-center font-bold text-lg">{newEntry.bcs}</div>
                <div className="text-white/80 text-center text-xs">
                  {newEntry.bcs <= 3 ? 'Underweight' : newEntry.bcs <= 5 ? 'Ideal' : newEntry.bcs <= 7 ? 'Overweight' : 'Obese'}
                </div>
              </div>
            </div>
            <button
              onClick={addEntry}
              className="mt-4 bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              Add Entry
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Trends</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">BCS vs Weight</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[1, 9]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]} label={{ value: 'BCS', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} name="Weight (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="bcs" stroke="#10b981" strokeWidth={2} name="BCS" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">BCS vs Food Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" label={{ value: `Food Intake (cal/day)`, angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[1, 9]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]} label={{ value: 'BCS', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="foodIntake" stroke="#3b82f6" strokeWidth={2} name="Food Intake (cal/day)" />
                  <Line yAxisId="right" type="monotone" dataKey="bcs" stroke="#10b981" strokeWidth={2} name="BCS" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Weight vs Food Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: `Food Intake (cal/day)`, angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} name="Weight (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="foodIntake" stroke="#3b82f6" strokeWidth={2} name="Food Intake (cal/day)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Entries</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Weight (kg)</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Food Intake (cal/day)</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">BCS</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.slice().reverse().map((entry, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="px-4 py-3">{entry.date}</td>
                      <td className="px-4 py-3">{entry.weight}</td>
                      <td className="px-4 py-3">{entry.foodIntake}</td>
                      <td className="px-4 py-3">
                        {entry.bcs}
                        <span className="ml-2 text-xs text-gray-500">
                          ({entry.bcs <= 3 ? 'Underweight' : entry.bcs <= 5 ? 'Ideal' : entry.bcs <= 7 ? 'Overweight' : 'Obese'})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteEntry(entries.length - 1 - index)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xl"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
   </div> 
  );
}