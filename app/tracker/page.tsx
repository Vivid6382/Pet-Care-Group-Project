"use client";
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function PetHealthTracker() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [profiles, setProfiles] = useState<Array<{id: string; name: string; species: string}>>([]);
  const [currentProfile, setCurrentProfile] = useState<{id: string; name: string; species: string} | null>(null);
  const [entries, setEntries] = useState<Array<{id: string; date: string; weight: number; foodIntake: number; bcs: number}>>([]);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBCSGuide, setShowBCSGuide] = useState(false);
  const [selectedChart, setSelectedChart] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [dateRange, setDateRange] = useState('30days');

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    foodIntake: '',
    bcs: 5,
  });

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Profiles from Firestore
  useEffect(() => {
    if (!user) {
      setProfiles([]);
      setCurrentProfile(null);
      return;
    }

    const petsRef = collection(db, 'users', user.uid, 'pets');
    const unsubscribe = onSnapshot(petsRef, (snapshot) => {
      const loadedProfiles = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        species: doc.data().species || doc.data().type 
      }));
      setProfiles(loadedProfiles);
      
      if (!currentProfile && loadedProfiles.length > 0) {
        setCurrentProfile(loadedProfiles[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Load Entries for selected pet
  useEffect(() => {
    if (!user || !currentProfile) {
      setEntries([]);
      return;
    }

    const entriesRef = collection(db, 'users', user.uid, 'pets', currentProfile.id, 'entries');
    const q = query(entriesRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setEntries(loadedEntries);
    });

    return () => unsubscribe();
  }, [user, currentProfile]);

  // --- Actions ---

  const addEntry = async () => {
    if (!user || !currentProfile) return;
    if (newEntry.date && newEntry.weight && newEntry.foodIntake) {
      try {
        const entriesRef = collection(db, 'users', user.uid, 'pets', currentProfile.id, 'entries');
        await addDoc(entriesRef, {
          date: newEntry.date,
          weight: parseFloat(newEntry.weight),
          foodIntake: parseFloat(newEntry.foodIntake),
          bcs: newEntry.bcs
        });
        setNewEntry({ date: new Date().toISOString().split('T')[0], weight: '', foodIntake: '', bcs: 5 });
      } catch (e) { console.error(e); }
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user || !currentProfile) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'pets', currentProfile.id, 'entries', entryId));
    } catch (e) { console.error(e); }
  };

  const filteredEntries = searchDate ? entries.filter(entry => entry.date === searchDate) : entries;
  
  const getChartData = () => {
    const now = new Date();
    let cutoffDate = new Date();
    switch(dateRange) {
      case '7days': cutoffDate.setDate(now.getDate() - 7); break;
      case '30days': cutoffDate.setDate(now.getDate() - 30); break;
      case '90days': cutoffDate.setDate(now.getDate() - 90); break;
      case '1year': cutoffDate.setFullYear(now.getFullYear() - 1); break;
      case 'all': return entries;
      default: cutoffDate.setDate(now.getDate() - 30);
    }
    return entries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="text-4xl mb-4">🐾</div><p className="text-gray-600">Loading...</p></div></div>;

  if (!user) return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-blue-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Pet Health Tracker</h2>
          <p className="text-gray-600 mb-6">Please sign in to track your pet's health data</p>
        </div>
      </div>
      <Footer />
    </div>
  );

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
      
      {showBCSGuide && currentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowBCSGuide(false)}>
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Body Condition Score Guide</h2>
              <button onClick={() => setShowBCSGuide(false)} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">✕</button>
            </div>
            <div className="p-6">
              <img src={currentProfile.species === 'Cat' ? '/images/Cat_BCS.png' : '/images/Dog_BCS.png'} alt="BCS Guide" className="w-full h-auto" />
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
            
            <div className="flex items-center gap-3">
              {currentProfile && (
                <div className="relative">
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 bg-gradient-to-r from-blue-400 to-blue-400 text-black border-2 border-black px-6 py-3 rounded-lg font-semibold shadow-md">
                    <span className="text-2xl">{currentProfile.species === 'Dog' ? '🐕' : '🐈'}</span>
                    <div className="text-left">
                      <div className="text-sm opacity-90">Current Pet</div>
                      <div className="font-bold">{currentProfile.name}</div>
                    </div>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-[3px] border-black z-10">
                      <div className="p-2">
                        {profiles.map((p) => (
                          <div key={p.id} className="flex items-center gap-2">
                            <button onClick={() => { setCurrentProfile(p); setShowProfileMenu(false); }} className={`flex-1 text-left px-4 py-3 rounded-md ${currentProfile.id === p.id ? 'bg-blue-400 text-white font-semibold' : 'hover:bg-gray-200'}`}>
                              {p.name} ({p.species})
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {!currentProfile ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
               <p className="text-gray-600 text-lg mb-2">No pets found</p>
               <p className="text-sm text-gray-400">Please add a pet in your <span className="font-bold text-blue-500">Profile page</span> to start tracking.</p>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 lg:h-[600px] lg:w-[1000px]">
            <div className="bg-gradient-to-r from-blue-300 to-blue-300 shadow-lg rounded-xl p-6 overflow-y-auto flex flex-col lg:col-span-2">
              <h2 className="text-2xl font-bold text-black mb-6 flex-shrink-0">Add Daily Entry</h2>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-black text-sm font-semibold mb-2 ">Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} className="w-full p-4 font-bold text-gray-700 bg-white border-[3px] border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2">Weight (kg)</label>
                  <input type="number" step="0.1" value={newEntry.weight} onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })} className="w-full p-4 font-bold text-gray-700 bg-white border-[3px] border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2">Food Intake (cal/day)</label>
                  <input type="number" value={newEntry.foodIntake} onChange={(e) => setNewEntry({ ...newEntry, foodIntake: e.target.value })} className="w-full p-4 font-bold text-gray-700 bg-white border-[3px] border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-black text-sm font-semibold mb-2 flex items-center gap-2">
                    BCS (1-9) <button onClick={() => setShowBCSGuide(true)}>❓</button>
                  </label>
                  <input type="range" min="1" max="9" value={newEntry.bcs} onChange={(e) => setNewEntry({ ...newEntry, bcs: parseInt(e.target.value) })} className="w-full" />
                  <div className="text-black text-center font-bold text-lg">{newEntry.bcs}</div>
                </div>
              </div>
              <button onClick={addEntry} className="block mx-auto w-full font-bold text-2xl text-white bg-blue-500 rounded-full border-4 border-black p-3 text-center hover:bg-white hover:text-blue-500 transition-all">+ Add Entry</button>
            </div>

            <div className="bg-gray-50 shadow-lg rounded-xl p-6 flex flex-col overflow-hidden lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">All Entries</h2>
                <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="px-3 py-2 rounded-lg border-2 border-gray-300" />
              </div>
              <div className="overflow-y-auto flex-1 space-y-3">
                {filteredEntries.slice().reverse().map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold text-gray-600">{entry.date}</span>
                      <button onClick={() => deleteEntry(entry.id)} className="text-red-500">🗑️</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><div className="text-xs text-gray-500">Weight</div><div className="font-bold">{entry.weight} kg</div></div>
                      <div><div className="text-xs text-gray-500">Food</div><div className="font-bold">{entry.foodIntake} cal</div></div>
                      <div><div className="text-xs text-gray-500">BCS</div><div className="font-bold">{entry.bcs}/9</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Health Trends</h2>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 rounded-lg border-2 border-gray-300">
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="flex gap-2 mb-6">
              {['BCS vs Weight', 'BCS vs Food Intake', 'Weight vs Food Intake', 'All'].map(chart => (
                <button key={chart} onClick={() => setSelectedChart(chart)} className={`px-4 py-2 rounded-lg font-semibold ${selectedChart === chart ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
                  {chart}
                </button>
              ))}
            </div>

            <div className="h-[400px]">
              {getChartData().length < 2 ? (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">Add more entries to see trends</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    {(selectedChart === 'BCS vs Weight' || selectedChart === 'All' || selectedChart === 'Weight vs Food Intake') && <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" name="Weight (kg)" />}
                    {(selectedChart === 'BCS vs Weight' || selectedChart === 'BCS vs Food Intake' || selectedChart === 'All') && <Line yAxisId="right" type="monotone" dataKey="bcs" stroke="#10b981" name="BCS" />}
                    {(selectedChart === 'BCS vs Food Intake' || selectedChart === 'Weight vs Food Intake' || selectedChart === 'All') && <Line yAxisId="left" type="monotone" dataKey="foodIntake" stroke="#3b82f6" name="Food Intake" />}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}