'use client'
import { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  getDoc,
  getCountFromServer
} from 'firebase/firestore';
// --- Interfaces ---
interface Entry {
  id: string;
  [key: string]: any;
}
interface Pet {
  id: string;
  entries?: Entry[];
  entryCount?: number;
  [key: string]: any;
}
interface EventDoc {
  id: string;
  [key: string]: any;
}
interface User {
  id: string;
  pets?: Pet[];
  events?: EventDoc[];
  [key: string]: any;
}
interface Feedback {
  id: string;
  [key: string]: any;
}
type TabType = 'manage-users' | 'feedback';
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('manage-users');
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  // used for per-pet collapse state
  const [expandedPets, setExpandedPets] = useState<Record<string, boolean>>({});
  // per-event collapse state
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // SEARCH STATE (NEW)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'any' | 'id' | 'email' | 'displayName'>('any');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace('/')
        return
      }
      try {
        const userRef = doc(db, 'users', currentUser.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists() || userSnap.data().admin !== true) {
          router.replace('/')
          return
        }
        setIsAdmin(true)
      } catch (err) {
        console.error('Admin check failed', err)
        router.replace('/')
      } finally {
        setCheckingAuth(false)
      }
    })
    return () => unsubscribe()
  }, [router])
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'feedback') {
        fetchFeedback();
      } else {
        fetchUsers();
      }
    }
  }, [isAdmin, activeTab]);
  // --- Helpers ---
  const formatDisplayValue = (value: any): string => {
    if (value instanceof Timestamp) return value.toDate().toLocaleString();
    if (value && typeof value === 'object' && 'seconds' in value) return new Date(value.seconds * 1000).toLocaleString();
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
  const docFromPath = (path: string) => {
    // path like "users/uid/pets/petId" -> doc(db, 'users', 'uid', 'pets', 'petId')
    const parts = path.split('/').filter(Boolean);
    return doc(db, ...(parts as [string, ...string[]]));
  };
  // --- Actions ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const usersList: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error: any) {
      alert('Error fetching users: ' + error.message);
    }
    setLoadingUsers(false);
  };
  const loadUserData = async (userId: string) => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return;
      const petsCol = collection(db, `users/${userId}/pets`);
      const petsSnapshot = await getDocs(petsCol);
      const petsPromises = petsSnapshot.docs.map(async (petDoc) => {
        const entriesCol = collection(db, `users/${userId}/pets/${petDoc.id}/entries`);
        const countSnap = await getCountFromServer(entriesCol);
        const entryCount = countSnap.data().count;
        return { id: petDoc.id, ...petDoc.data(), entryCount } as Pet;
      });
      const pets = await Promise.all(petsPromises);
      const eventsCol = collection(db, `users/${userId}/events`);
      const eventsSnapshot = await getDocs(eventsCol);
      const events = eventsSnapshot.docs.map(e => ({ id: e.id, ...e.data() } as EventDoc));
      const newUsers = [...users];
      newUsers[userIndex] = { ...newUsers[userIndex], pets, events };
      setUsers(newUsers);
    } catch (error: any) {
      alert('Error loading user data: ' + error.message);
    }
  };
  const loadPetEntries = async (userId: string, petId: string) => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return;
      const petIndex = users[userIndex].pets!.findIndex(p => p.id === petId);
      if (petIndex === -1) return;
      const entriesCol = collection(db, `users/${userId}/pets/${petId}/entries`);
      const entriesSnapshot = await getDocs(entriesCol);
      const entries = entriesSnapshot.docs.map(e => ({ id: e.id, ...e.data() } as Entry));
      const newUsers = [...users];
      newUsers[userIndex].pets![petIndex] = { ...newUsers[userIndex].pets![petIndex], entries };
      setUsers(newUsers);
    } catch (error: any) {
      alert('Error loading pet entries: ' + error.message);
    }
  };
  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const feedbackCol = collection(db, 'feedback');
      const feedbackSnapshot = await getDocs(feedbackCol);
      setFeedback(feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback)));
    } catch (error: any) {
      alert('Error fetching feedback: ' + error.message);
    }
    setLoadingFeedback(false);
  };
  const deleteItem = async (path: string) => {
    if (!confirm('Delete this item and all sub-data?')) return;
    try {
      await deleteDoc(docFromPath(path));
      const parts = path.split('/').filter(Boolean);
      if (parts[0] === 'feedback') {
        setFeedback(prev => prev.filter(f => f.id !== parts[1]));
      } else if (parts[0] === 'users') {
        if (parts.length === 2) {
          // delete user
          setUsers(prev => prev.filter(u => u.id !== parts[1]));
        } else if (parts.length === 4 && parts[2] === 'pets') {
          // delete pet
          setUsers(prev => {
            return prev.map(u => {
              if (u.id === parts[1]) {
                return { ...u, pets: u.pets?.filter(p => p.id !== parts[3]) };
              }
              return u;
            });
          });
        } else if (parts.length === 4 && parts[2] === 'events') {
          // delete event
          setUsers(prev => {
            return prev.map(u => {
              if (u.id === parts[1]) {
                return { ...u, events: u.events?.filter(e => e.id !== parts[3]) };
              }
              return u;
            });
          });
        }
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };
  // NEW: toggle expand/collapse for users
  const toggleExpandUser = (userId: string) => {
    setExpandedUsers(prev => {
      const isExpanding = !prev[userId];
      if (isExpanding) {
        const user = users.find(u => u.id === userId);
        if (user && user.pets === undefined) {
          loadUserData(userId);
        }
      }
      return { ...prev, [userId]: isExpanding };
    });
  };
  // NEW: toggle expand/collapse for pets
  const toggleExpandPet = (userId: string, petId: string) => {
    const key = `${userId}::${petId}`;
    setExpandedPets(prev => {
      const isExpanding = !prev[key];
      if (isExpanding) {
        const user = users.find(u => u.id === userId);
        const pet = user?.pets?.find(p => p.id === petId);
        if (pet && pet.entries === undefined) {
          loadPetEntries(userId, petId);
        }
      }
      return { ...prev, [key]: isExpanding };
    });
  };
  // NEW: toggle expand/collapse for events
  const toggleExpandEvent = (userId: string, eventId: string) => {
    const key = `${userId}::${eventId}`;
    setExpandedEvents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // SEARCH HELPERS (NEW)
  const normalize = (s: any) => (s === undefined || s === null) ? '' : String(s).toLowerCase();
  const userMatchesQuery = (user: User, query: string, field: typeof searchField) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (field === 'id') return user.id.toLowerCase().includes(q);
    if (field === 'email') return normalize(user.email).includes(q);
    if (field === 'displayName') return normalize(user.displayName || user.name).includes(q);
    // 'any' - search across all values
    for (const key of Object.keys(user)) {
      if (key === 'pets' || key === 'events') continue; // skip heavy nested arrays
      const val = (user as any)[key];
      if (normalize(val).includes(q)) return true;
    }
    return false;
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(u => userMatchesQuery(u, searchQuery, searchField));
  }, [users, searchQuery, searchField]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-blue-600">
        Checking admin permissions...
      </div>
    )
  }
  if (!isAdmin) return null;
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'manage-users', label: 'Manage Users' },
              { id: 'feedback', label: 'Feedback' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {activeTab === 'manage-users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">User, Pet & Entry Management</h2>

            {/* SEARCH UI (NEW) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-600">Search</label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setSearchQuery(''); }}
                  placeholder="Type to search users..."
                  className="border rounded px-3 py-2 text-sm w-[320px]"
                />
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >Clear</button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Field</label>
                <select value={searchField} onChange={(e) => setSearchField(e.target.value as any)} className="border rounded px-3 py-2 text-sm">
                  <option value="any">Any field</option>
                  <option value="id">User ID</option>
                  <option value="email">Email</option>
                  <option value="displayName">Name</option>
                </select>
              </div>
              <div className="ml-auto text-xs text-gray-500">Showing {filteredUsers.length} of {users.length} users</div>
            </div>

            {loadingUsers ? (
              <div className="text-center py-8 animate-pulse text-blue-600 font-medium">Loading users...</div>
            ) : (
              filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users match your search.</div>
              ) : (
                filteredUsers.map(user => {
                  const userPath = `users/${user.id}`;
                  return (
                    <div key={user.id} className="mb-6 border rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-100 p-3 flex justify-between items-center border-b">
                        <button
                          onClick={() => toggleExpandUser(user.id)}
                          className="flex items-center gap-2 font-bold text-gray-700"
                        >
                          <span className="text-xs">{expandedUsers[user.id] ? '▼' : '▶'}</span>
                          User: {user.id}
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => deleteItem(userPath)} className="text-red-400 hover:text-red-600 p-1 text-lg">🗑️</button>
                        </div>
                      </div>
                      {expandedUsers[user.id] && (
                        <div className="p-4 space-y-4">
                          {user.pets === undefined ? (
                            <div className="text-center py-4 animate-pulse text-blue-600 font-medium">Loading user data...</div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-4 border-b">
                                {Object.entries(user).filter(([k]) => k !== 'id' && k !== 'pets' && k !== 'events').map(([k, v]) => (
                                  <div key={k} className="text-xs">
                                    <span className="font-bold text-gray-500 uppercase">{k}:</span> {formatDisplayValue(v)}
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-4 pt-2">
                                {/* PETS */}
                                <div className="mt-4 ml-2">
                                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Pets</h3>
                                  {user.pets.length === 0 ? (
                                    <div className="text-xs text-gray-400">No pets</div>
                                  ) : (
                                    user.pets.map(pet => {
                                      const petPath = `${userPath}/pets/${pet.id}`;
                                      const petKey = `${user.id}::${pet.id}`;
                                      const isExpanded = !!expandedPets[petKey];
                                      return (
                                        <div key={pet.id} className="mb-3 border rounded-md bg-gray-50">
                                          {/* Pet header - always visible */}
                                          <div className="p-3 flex justify-between items-center gap-4">
                                            <button onClick={() => toggleExpandPet(user.id, pet.id)} className="flex items-center gap-2 text-left">
                                              <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                                              <div className="text-sm font-medium text-gray-700">{pet.name ?? pet.id}</div>
                                              <div className="text-[11px] text-gray-400 ml-2">Entries: {pet.entryCount ?? pet.entries?.length ?? 0}</div>
                                            </button>
                                            <div className="flex items-center gap-3">
                                              <button onClick={() => deleteItem(petPath)} className="text-red-500">🗑️</button>
                                            </div>
                                          </div>
                                          {/* Collapsible details (read-only) */}
                                          {isExpanded && (
                                            <div className="p-3 border-t text-xs space-y-3">
                                              <div className="text-gray-700 space-y-1">
                                                {Object.entries(pet)
                                                  .filter(([k]) => k !== 'id' && k !== 'entries' && k !== 'entryCount')
                                                  .map(([k, v]) => (
                                                    <div key={k}>
                                                      <strong className="mr-1">{k}:</strong>
                                                      {formatDisplayValue(v)}
                                                    </div>
                                                  ))}
                                              </div>
                                              {/* ENTRIES (read-only, inside same card) */}
                                              <div className="mt-2 border-t pt-2">
                                                <div className="text-[11px] font-semibold text-gray-500 mb-1">Entries ({pet.entryCount ?? pet.entries?.length ?? 0})</div>
                                                {pet.entries === undefined ? (
                                                  <div className="text-xs text-blue-600 animate-pulse">Loading entries...</div>
                                                ) : pet.entries.length === 0 ? (
                                                  <div className="text-xs text-gray-400">No entries</div>
                                                ) : (
                                                  <div className="space-y-1 text-xs">
                                                    {pet.entries.map(entry => (
                                                      <div key={entry.id} className="bg-white border rounded px-2 py-1">
                                                        {Object.entries(entry)
                                                          .filter(([k]) => k !== 'id')
                                                          .map(([k, v]) => (
                                                            <div key={k}><strong>{k}:</strong> {formatDisplayValue(v)}</div>
                                                          ))}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                          <div className="px-3 pb-3 text-xs text-gray-400">{pet.id}</div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                                {/* EVENTS */}
                                <div className="mt-4 ml-2">
                                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Events</h3>
                                  {user.events?.length === 0 ? (
                                    <div className="text-xs text-gray-400">No events</div>
                                  ) : (
                                    user.events!.map(event => {
                                      const eventPath = `${userPath}/events/${event.id}`;
                                      const eventKey = `${user.id}::${event.id}`;
                                      const isExpanded = !!expandedEvents[eventKey];
                                      return (
                                        <div key={event.id} className="mb-3 border rounded-md bg-gray-50">
                                          <div className="p-3 flex justify-between items-center gap-4">
                                            <button onClick={() => toggleExpandEvent(user.id, event.id)} className="flex items-center gap-2 text-left">
                                              <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                                              <div className="text-sm font-medium text-gray-700">{event.title ?? event.id}</div>
                                              <div className="text-[11px] text-gray-400 ml-2">{formatDisplayValue(event.date ?? '')}</div>
                                            </button>
                                            <div className="flex items-center gap-3">
                                              <button onClick={() => deleteItem(eventPath)} className="text-red-500">🗑️</button>
                                            </div>
                                          </div>
                                          {isExpanded && (
                                            <div className="p-3 border-t text-xs space-y-3">
                                              <div className="text-gray-700">
                                                {Object.entries(event).filter(([k]) => k !== 'id').map(([k, v]) => (
                                                  <div key={k}><strong className="mr-1">{k}:</strong> {formatDisplayValue(v)}</div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          <div className="px-3 pb-3 text-xs text-gray-400">{event.id}</div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )
            )}
          </div>
        )}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><span>💬</span> Feedback</h2>
            {loadingFeedback ? (
              <div className="text-center py-8 animate-pulse text-blue-600 font-medium">Loading feedback...</div>
            ) : (
              <div className="grid gap-4">
                {feedback.map(item => (
                  <div key={item.id} className="border rounded-xl p-5 bg-white relative">
                    <button onClick={() => deleteItem(`feedback/${item.id}`)} className="absolute top-4 right-4 grayscale hover:grayscale-0">🗑️</button>
                    {Object.entries(item).filter(([k]) => k !== 'id').map(([k, v]) => (
                      <div key={k} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">{k}</span>
                        <span className="text-sm text-gray-700">{formatDisplayValue(v)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}