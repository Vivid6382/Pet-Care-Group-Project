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
  const [selectedChart, setSelectedChart] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [dateRange, setDateRange] = useState('30days'); // NEW: Date range filter for charts

  const entries = profileData[currentProfile.id] || [];

  // Filter entries by search date
  const filteredEntries = searchDate 
    ? entries.filter(entry => entry.date === searchDate)
    : entries;
  
  // NEW: Filter entries for charts based on date range
  const getChartData = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(dateRange) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return entries;
      default:
        cutoffDate.setDate(now.getDate() - 30);
    }
    
    return entries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

 

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
                className="flex items-center gap-3 bg-gradient-to-r from-blue-400 to-blue-400 text-black px-6 py-3 rounded-lg font-semibold hover:from-blue-400 hover:to-blue-500 transition-all shadow-md"
              >
                <span className="text-2xl"></span>
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


          {/* Side by Side Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 lg:h-[600px] lg:w-[1000px]">

          {/* Add Daily Entry - Left Side */}  
          <div className="bg-gradient-to-r from-blue-300 to-blue-300 shadow-lg rounded-xl p-6 overflow-y-auto flex flex-col lg:col-span-2">
              <h2 className="text-2xl font-bold text-black mb-6 flex-shrink-0">Add Daily Entry</h2>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-black text-sm font-semibold mb-2 ">Date</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-black/50 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:border-white "
                  />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                    placeholder="12.5"
                    className="w-full px-3 py-2 rounded-lg border-2 border-black/50 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2">Food Intake (cal/day)</label>
                  <input
                    type="number"
                    step="1"
                    value={newEntry.foodIntake}
                    onChange={(e) => setNewEntry({ ...newEntry, foodIntake: e.target.value })}
                    placeholder="850"
                    className="w-full px-3 py-2 rounded-lg border-2 border-black/50 bg-white/20 text-black placeholder-black/70 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2 flex items-center gap-2">
                    BCS (1-9)
                    <button
                      onClick={() => setShowBCSGuide(!showBCSGuide)}
                      className="text-white hover:text-yellow-200 text-lg font-bold cursor-pointer"
                      type="button"
                      aria-label="Show BCS Guide"
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
                    className="w-full mb-1"
                  />
                  <div className="text-black text-center font-bold text-lg">{newEntry.bcs}</div>
                  <div className="text-black/80 text-center text-xs">
                    {newEntry.bcs <= 3 ? 'Underweight' : newEntry.bcs <= 5 ? 'Ideal' : newEntry.bcs <= 7 ? 'Overweight' : 'Obese'}
                  </div>
                </div>
              </div>
              <button
                onClick={addEntry}
                className="block mx-auto w-full font-bold text-2xl text-white bg-blue-500 rounded-full border-4 border-black p-3 text-center hover:bg-white hover:text-blue-500 transition-all duration-200"
              
              >
                <span className="text-xl"></span>
                + Add Entry
              </button>
            </div>


          {/* All Entries - Right Side */}
          <div className="bg-gray-50 shadow-lg rounded-xl p-6 flex flex-col overflow-hidden lg:col-span-3">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800">All Entries</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    placeholder="Search by date"
                    className="px-3 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-400"
                  />
                  {searchDate && (
                    <button
                      onClick={() => setSearchDate('')}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🐾</span>
                    <p className="text-gray-600 text-lg mb-2">
                      {searchDate 
                        ? `No entries found for ${searchDate}`
                        : `No entries yet for ${currentProfile.name}`
                      }
                    </p>
                    <p className="text-gray-400 text-sm">
                      {searchDate 
                        ? 'Try a different date or clear the search'
                        : 'Add your first entry to start tracking!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEntries.slice().reverse().map((entry, index) => {
                      const originalIndex = entries.length - 1 - entries.slice().reverse().indexOf(entry);
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-semibold text-gray-600">{entry.date}</span>
                            <button
                              onClick={() => deleteEntry(originalIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors text-lg cursor-pointer"
                              title="Delete entry"
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Weight</div>
                              <div className="font-bold text-gray-800">{entry.weight} kg</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Food Intake</div>
                              <div className="font-bold text-gray-800">{entry.foodIntake} cal</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">BCS</div>
                              <div className="font-bold text-gray-800">
                                {entry.bcs}/9
                                <span className="block text-xs font-normal text-gray-500">
                                  {entry.bcs <= 3 ? 'Underweight' : entry.bcs <= 5 ? 'Ideal' : entry.bcs <= 7 ? 'Overweight' : 'Obese'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* Health Trends Charts */}
          <div className="bg-gray-50 shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Health Trends</h2>
              
              {/* NEW: Date Range Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">Time Period:</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold focus:outline-none focus:border-blue-400"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedChart('BCS vs Weight')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedChart === 'BCS vs Weight'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                BCS vs Weight
              </button>
              <button
                onClick={() => setSelectedChart('BCS vs Food Intake')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedChart === 'BCS vs Food Intake'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                BCS vs Food Intake
              </button>
              <button
                onClick={() => setSelectedChart('Weight vs Food Intake')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedChart === 'Weight vs Food Intake'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weight vs Food Intake
              </button>
              <button
                onClick={() => setSelectedChart('All')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedChart === 'All'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </div>

            {/* NEW: Show chart data count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{getChartData().length}</span> of <span className="font-semibold">{entries.length}</span> total entries
            </div>
            
            {getChartData().length < 2 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">Add at least 2 entries in the selected time period to see health trends</p>
              </div>
            ) : (
              <>
                {(selectedChart === 'BCS vs Weight' || selectedChart === 'All') && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">BCS vs Weight</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={Math.floor(getChartData().length / 10)}
                        />
                        <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                        <YAxis yAxisId="right" orientation="right" domain={[1, 9]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]} label={{ value: 'BCS', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} name="Weight (kg)" />
                        <Line yAxisId="right" type="monotone" dataKey="bcs" stroke="#10b981" strokeWidth={2} name="BCS" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {(selectedChart === 'BCS vs Food Intake' || selectedChart === 'All') && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">BCS vs Food Intake</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={Math.floor(getChartData().length / 10)}
                        />
                        <YAxis yAxisId="left" label={{ value: `Food Intake (cal/day)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                        <YAxis yAxisId="right" orientation="right" domain={[1, 9]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]} label={{ value: 'BCS', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="foodIntake" stroke="#3b82f6" strokeWidth={2} name="Food Intake (cal/day)" />
                        <Line yAxisId="right" type="monotone" dataKey="bcs" stroke="#10b981" strokeWidth={2} name="BCS" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {(selectedChart === 'Weight vs Food Intake' || selectedChart === 'All') && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Weight vs Food Intake</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={Math.floor(getChartData().length / 10)}
                        />
                        <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: `Food Intake (cal/day)`, angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} name="Weight (kg)" />
                        <Line yAxisId="right" type="monotone" dataKey="foodIntake" stroke="#3b82f6" strokeWidth={2} name="Food Intake (cal/day)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>

        


          
        </div>
      </div>
    </div>
    <Footer />
   </div> 
  );
}