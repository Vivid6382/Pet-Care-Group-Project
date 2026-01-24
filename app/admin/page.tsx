'use client'
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  getDoc,
  getCountFromServer,
  DocumentData,
  deleteField
} from 'firebase/firestore';
// --- Interfaces ---
interface Entry extends DocumentData {
  id: string;
}
interface Pet extends DocumentData {
  id: string;
  name?: string;
  entries?: Entry[];
  entryCount?: number;
}
interface EventDoc extends DocumentData {
  id: string;
  title?: string;
}
interface UserProfile extends DocumentData {
  id: string;
  email?: string;
  displayName?: string;
  name?: string;
  admin?: boolean;
  pets?: Pet[];
  events?: EventDoc[];
}
interface Feedback extends DocumentData {
  id: string;
}
type TabType = 'manage-users' | 'feedback';
type SearchField = 'any' | 'id' | 'email' | 'displayName';
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('manage-users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  // UI Expansion States
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [expandedPets, setExpandedPets] = useState<Record<string, boolean>>({});
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  // Loading States
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const [loadingUserSubdata, setLoadingUserSubdata] = useState<Record<string, boolean>>({});
  const [loadingPetEntries, setLoadingPetEntries] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // --- GENERALIZED EDITING STATE ---
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editJsonValue, setEditJsonValue] = useState<Record<string, string>>({});
  const [originalEditData, setOriginalEditData] = useState<Record<string, Record<string, any>>>({});
  // --- SAVING STATE ---
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('any');
  // --- Auth Check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      if (!currentUser) {
        router.replace('/');
        return;
      }
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists() || (userSnap.data() as UserProfile).admin !== true) {
          router.replace('/');
          return;
        }
        setIsAdmin(true);
      } catch (err) {
        router.replace('/');
      } finally {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);
  useEffect(() => {
    if (isAdmin) {
      activeTab === 'feedback' ? fetchFeedback() : fetchUsers();
    }
  }, [isAdmin, activeTab]);
  // --- Formatting Helpers ---
  const formatDisplayValue = (value: any): string => {
    if (value instanceof Timestamp) return value.toDate().toLocaleString();
    if (value && typeof value === 'object' && 'seconds' in value) return new Date(value.seconds * 1000).toLocaleString();
    if (Array.isArray(value)) return `Array(${value.length})`;
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return String(value ?? '');
  };
  const docFromPath = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    return doc(db, parts[0], ...parts.slice(1));
  };
  // --- Fetching Logic ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const userData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      setUsers(userData);
    } catch (error: any) {
      alert('Error fetching users: ' + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };
  const loadUserData = async (userId: string) => {
    try {
      const petsCol = collection(db, `users/${userId}/pets`);
      const petsSnapshot = await getDocs(petsCol);
      const pets = await Promise.all(petsSnapshot.docs.map(async (pDoc) => {
        const entriesCol = collection(db, `users/${userId}/pets/${pDoc.id}/entries`);
        const countSnap = await getCountFromServer(entriesCol);
        return { id: pDoc.id, ...pDoc.data(), entryCount: countSnap.data().count } as Pet;
      }));
      const eventsCol = collection(db, `users/${userId}/events`);
      const eventsSnapshot = await getDocs(eventsCol);
      const events = eventsSnapshot.docs.map(e => ({ id: e.id, ...e.data() } as EventDoc));
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, pets, events } : u));
    } catch (error: any) {
      console.error("Error loading user subdata:", error);
    }
  };
  const loadPetEntries = async (userId: string, petId: string) => {
    const pKey = `${userId}-${petId}`;
    try {
      const snap = await getDocs(collection(db, `users/${userId}/pets/${petId}/entries`));
      const entries = snap.docs.map(e => ({ id: e.id, ...e.data() } as Entry));
      setUsers(prev => prev.map(u => {
        if (u.id !== userId) return u;
        return { ...u, pets: u.pets?.map(p => p.id === petId ? { ...p, entries } : p) };
      }));
    } catch (error: any) {
      console.error("Error loading entries:", error);
    }
  };
  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const snap = await getDocs(collection(db, 'feedback'));
      setFeedback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback)));
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoadingFeedback(false);
    }
  };
  // --- CRUD Actions ---
  const deleteItem = async (path: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await deleteDoc(docFromPath(path));
      const parts = path.split('/');
      if (parts[0] === 'feedback') {
        fetchFeedback();
      } else if (parts[0] === 'users') {
        const userId = parts[1];
        if (parts.length === 4) {
          const coll = parts[2];
          const itemId = parts[3];
          if (coll === 'pets') {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, pets: u.pets?.filter(p => p.id !== itemId) ?? [] } : u));
          } else if (coll === 'events') {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, events: u.events?.filter(e => e.id !== itemId) ?? [] } : u));
          }
        } else if (parts.length === 6 && parts[2] === 'pets' && parts[4] === 'entries') {
          const petId = parts[3];
          const entryId = parts[5];
          setUsers(prev => prev.map(u => u.id === userId ? {
            ...u,
            pets: u.pets?.map(p => p.id === petId ? {
              ...p,
              entries: p.entries?.filter(en => en.id !== entryId) ?? [],
              entryCount: p.entryCount ? Math.max(0, p.entryCount - 1) : 0
            } : p) ?? []
          } : u));
        }
      }
      alert("Deleted successfully.");
    } catch (error: any) {
      alert(error.message);
    }
  };
  const startEditing = (path: string, data: any) => {
    const editableData: Record<string, any> = {};
    Object.entries(data).forEach(([k, v]) => {
      if (['id', 'pets', 'events', 'entries', 'entryCount'].includes(k)) return;
      editableData[k] = v instanceof Timestamp ? v.toDate().toISOString() : v;
    });
    setEditJsonValue(prev => ({ ...prev, [path]: JSON.stringify(editableData, null, 2) }));
    setOriginalEditData(prev => ({ ...prev, [path]: { ...editableData } }));
    setEditMode(prev => ({ ...prev, [path]: true }));
  };
  const cancelEdit = (path: string) => {
    setEditMode(prev => {
      const newEditMode = { ...prev };
      delete newEditMode[path];
      return newEditMode;
    });
    setEditJsonValue(prev => {
      const newEditJsonValue = { ...prev };
      delete newEditJsonValue[path];
      return newEditJsonValue;
    });
    setOriginalEditData(prev => {
      const newOrig = { ...prev };
      delete newOrig[path];
      return newOrig;
    });
  };
  const saveChanges = async (path: string) => {
    setSaving(prev => ({ ...prev, [path]: true }));
    try {
      const newPayloadRaw: Record<string, any> = JSON.parse(editJsonValue[path] || '{}');

      // Process values (convert ISO date strings back to Timestamp)
      const processedPayload: Record<string, any> = {};
      for (const [key, value] of Object.entries(newPayloadRaw)) {
        let val = value;
        if (typeof val === 'string') {
          const trimmed = val.trim();
          // Loose ISO check – if it parses as a valid date, treat as Timestamp
          const date = new Date(trimmed);
          if (!isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
            val = Timestamp.fromDate(date);
          }
        }
        processedPayload[key] = val;
      }

      // Add field deletes for removed keys
      const original = originalEditData[path] || {};
      Object.keys(original).forEach((key) => {
        if (!(key in newPayloadRaw)) {
          processedPayload[key] = deleteField();
        }
      });

      // Perform update
      const docRef = docFromPath(path);
      await updateDoc(docRef, processedPayload);

      // Fetch fresh document to accurately reflect deletes and type conversions
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        const updatedData = updatedSnap.data()!;

        const parts = path.split('/');
        const userId = parts[1];

        if (parts.length === 2 && parts[0] === 'users') {
          // Top-level user
          setUsers(prev => prev.map(u =>
            u.id === userId
              ? { id: u.id, pets: u.pets, events: u.events, ...updatedData }
              : u
          ));
        } else if (parts.length === 4 && parts[0] === 'users') {
          const coll = parts[2];
          const itemId = parts[3];
          if (coll === 'pets') {
            setUsers(prev => prev.map(u =>
              u.id === userId
                ? {
                    ...u,
                    pets: u.pets?.map(p =>
                      p.id === itemId
                        ? { id: p.id, entryCount: p.entryCount ?? 0, entries: p.entries, ...updatedData }
                        : p
                    ) ?? []
                  }
                : u
            ));
          } else if (coll === 'events') {
            setUsers(prev => prev.map(u =>
              u.id === userId
                ? {
                    ...u,
                    events: u.events?.map(e =>
                      e.id === itemId
                        ? { id: e.id, ...updatedData }
                        : e
                    ) ?? []
                  }
                : u
            ));
          }
        } else if (parts.length === 6 && parts[0] === 'users' && parts[2] === 'pets' && parts[4] === 'entries') {
          const petId = parts[3];
          const entryId = parts[5];
          setUsers(prev => prev.map(u =>
            u.id === userId
              ? {
                  ...u,
                  pets: u.pets?.map(p =>
                    p.id === petId
                      ? {
                          ...p,
                          entries: p.entries?.map(en =>
                            en.id === entryId
                              ? { id: en.id, ...updatedData }
                              : en
                          ) ?? []
                        }
                      : p
                  ) ?? []
                }
              : u
          ));
        }
      }

      alert("Saved successfully!");
      cancelEdit(path);
    } catch (error: any) {
      alert("Invalid JSON or Update Error: " + error.message);
    } finally {
      setSaving(prev => {
        const newSaving = { ...prev };
        delete newSaving[path];
        return newSaving;
      });
    }
  };
  // --- Search Logic ---
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(user => {
      if (searchField === 'id') return user.id.toLowerCase().includes(q);
      if (searchField === 'email') return String(user.email || '').toLowerCase().includes(q);
      if (searchField === 'displayName') return String(user.displayName || user.name || '').toLowerCase().includes(q);
      return Object.values(user).some(val => String(val).toLowerCase().includes(q));
    });
  }, [users, searchQuery, searchField]);
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">
        Checking permissions...
      </div>
    );
  }
  // Button styles
  const btnBase = "px-3 py-1 rounded text-sm font-medium transition-colors duration-200";
  const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
  const btnSecondary = `${btnBase} bg-gray-200 text-gray-800 hover:bg-gray-300`;
  const btnDanger = `${btnBase} bg-red-600 text-white hover:bg-red-700`;
  const LoadingIndicator = ({ text, size = 'large' }: { text: string; size?: 'small' | 'large' }) => (
    <div className={`flex flex-col items-center justify-center ${size === 'large' ? 'py-20' : 'py-10'}`}>
      <div className={`animate-spin rounded-full ${size === 'large' ? 'h-10 w-10' : 'h-8 w-8'} border-b-2 border-blue-500 ${size === 'large' ? 'mb-4' : 'mb-2'}`}></div>
      <p className={`text-blue-500 font-medium ${size === 'small' ? 'text-sm' : ''}`}>{text}</p>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex border-b">
            {(['manage-users', 'feedback'] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-4 font-medium capitalize ${activeTab === t ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        {activeTab === 'manage-users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <input
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search database..."
                className="border rounded px-4 py-2 text-sm w-full md:w-80"
              />
              <select
                value={searchField}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchField(e.target.value as SearchField)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="any">Any Field</option>
                <option value="id">User ID</option>
                <option value="email">Email</option>
                <option value="displayName">Name</option>
              </select>
              <div className="text-xs text-gray-400">Found {filteredUsers.length} users</div>
            </div>
            {loadingUsers ? (
              <LoadingIndicator text="Loading Users..." />
            ) : (
              filteredUsers.map(user => {
                const uPath = `users/${user.id}`;
                return (
                  <div key={user.id} className="mb-6 border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-100 p-4 flex justify-between items-center">
                      <button
                        onClick={() => {
                          const willExpand = !expandedUsers[user.id];
                          setExpandedUsers(prev => ({ ...prev, [user.id]: willExpand }));
                          if (willExpand && !user.pets && !loadingUserSubdata[user.id]) {
                            setLoadingUserSubdata(prev => ({ ...prev, [user.id]: true }));
                            loadUserData(user.id).finally(() =>
                              setLoadingUserSubdata(prev => ({ ...prev, [user.id]: false }))
                            );
                          }
                        }}
                        className="font-bold text-gray-700 flex items-center gap-2"
                      >
                        <span>{expandedUsers[user.id] ? '▼' : '▶'}</span>
                        User: {user.email || user.id}
                      </button>
                      <div className="flex gap-2">
                        {editMode[uPath] ? (
                          <div className="flex gap-2">
                            <button
                              disabled={saving[uPath]}
                              onClick={() => saveChanges(uPath)}
                              className={`${btnPrimary} ${saving[uPath] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {saving[uPath] ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => cancelEdit(uPath)} className={btnSecondary}>Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => startEditing(uPath, user)} className={btnSecondary}>Edit User</button>
                        )}
                      </div>
                    </div>
                    {expandedUsers[user.id] && (
                      <div className="p-4 bg-white space-y-6">
                        {editMode[uPath] ? (
                          <textarea
                            value={editJsonValue[uPath]}
                            onChange={e => setEditJsonValue(v => ({ ...v, [uPath]: e.target.value }))}
                            className="w-full h-40 font-mono text-xs border p-3 rounded"
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs border-b pb-4">
                            {Object.entries(user)
                              .filter(([k]) => !['id', 'pets', 'events'].includes(k))
                              .map(([k, v]) => (
                                <div key={k}>
                                  <span className="font-bold uppercase text-gray-400">{k}:</span> {formatDisplayValue(v)}
                                </div>
                              ))}
                          </div>
                        )}
                        {loadingUserSubdata[user.id] ? (
                          <LoadingIndicator text="Loading pets and events..." size="small" />
                        ) : (
                          <>
                            <div className="space-y-4">
                              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pets</h3>
                              {user.pets && user.pets.length > 0 ? (
                                user.pets.map(pet => {
                                  const pPath = `${uPath}/pets/${pet.id}`;
                                  const pKey = `${user.id}-${pet.id}`;
                                  return (
                                    <div key={pet.id} className="border rounded-lg bg-gray-50 overflow-hidden">
                                      <div className="p-3 flex justify-between items-center bg-gray-200/50">
                                        <button
                                          onClick={() => {
                                            const willExpand = !expandedPets[pKey];
                                            setExpandedPets(prev => ({ ...prev, [pKey]: willExpand }));
                                            if (willExpand && !pet.entries && !loadingPetEntries[pKey]) {
                                              setLoadingPetEntries(prev => ({ ...prev, [pKey]: true }));
                                              loadPetEntries(user.id, pet.id).finally(() =>
                                                setLoadingPetEntries(prev => ({ ...prev, [pKey]: false }))
                                              );
                                            }
                                          }}
                                          className="text-sm font-semibold"
                                        >
                                          {expandedPets[pKey] ? '▼' : '▶'} {pet.name || 'Unnamed Pet'}
                                          <span className="text-[10px] text-gray-400 ml-2">
                                            ({pet.entryCount ?? 0} entries • ID: {pet.id})
                                          </span>
                                        </button>
                                        <div className="flex gap-2">
                                          {editMode[pPath] ? (
                                            <div className="flex gap-2">
                                              <button
                                                disabled={saving[pPath]}
                                                onClick={() => saveChanges(pPath)}
                                                className={`${btnPrimary} ${saving[pPath] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                              >
                                                {saving[pPath] ? 'Saving...' : 'Save'}
                                              </button>
                                              <button onClick={() => cancelEdit(pPath)} className={btnSecondary}>Cancel</button>
                                            </div>
                                          ) : (
                                            <button onClick={() => startEditing(pPath, pet)} className={btnSecondary}>Edit Pet</button>
                                          )}
                                          <button onClick={() => deleteItem(pPath)} className={btnDanger}>Delete</button>
                                        </div>
                                      </div>
                                      {expandedPets[pKey] && (
                                        <div className="p-3 space-y-4">
                                          {editMode[pPath] ? (
                                            <textarea value={editJsonValue[pPath]} onChange={e => setEditJsonValue(v => ({ ...v, [pPath]: e.target.value }))} className="w-full h-32 font-mono text-xs border p-2 rounded" />
                                          ) : (
                                            <div className="text-xs space-y-1">
                                              {Object.entries(pet).filter(([k]) => !['id', 'entries', 'entryCount'].includes(k)).map(([k, v]) => (
                                                <div key={k}><strong>{k}:</strong> {formatDisplayValue(v)}</div>
                                              ))}
                                            </div>
                                          )}
                                          <div className="pl-6 border-l-2 border-blue-200 space-y-2">
                                            <h4 className="text-[10px] font-bold text-blue-400 uppercase">Entries ({pet.entryCount ?? 0})</h4>
                                            {loadingPetEntries[pKey] ? (
                                              <LoadingIndicator text="Loading entries..." size="small" />
                                            ) : pet.entries && pet.entries.length > 0 ? (
                                              pet.entries.map(entry => {
                                                const enPath = `${pPath}/entries/${entry.id}`;
                                                return (
                                                  <div key={entry.id} className="bg-white p-2 border rounded shadow-sm text-[11px]">
                                                    <div className="flex justify-between items-center mb-1">
                                                      <span className="text-gray-400 font-mono italic">{entry.id}</span>
                                                      <div className="flex gap-2">
                                                        {editMode[enPath] ? (
                                                          <div className="flex gap-2">
                                                            <button
                                                              disabled={saving[enPath]}
                                                              onClick={() => saveChanges(enPath)}
                                                              className={`${btnPrimary} ${saving[enPath] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                              {saving[enPath] ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button onClick={() => cancelEdit(enPath)} className={btnSecondary}>Cancel</button>
                                                          </div>
                                                        ) : (
                                                          <button onClick={() => startEditing(enPath, entry)} className={btnSecondary}>Edit</button>
                                                        )}
                                                        <button onClick={() => deleteItem(enPath)} className={btnDanger}>Delete</button>
                                                      </div>
                                                    </div>
                                                    {editMode[enPath] ? (
                                                      <textarea value={editJsonValue[enPath]} onChange={e => setEditJsonValue(v => ({ ...v, [enPath]: e.target.value }))} className="w-full h-20 font-mono p-1 border rounded" />
                                                    ) : (
                                                      <div className="grid grid-cols-2 gap-x-4">
                                                        {Object.entries(entry).filter(([k]) => k !== 'id').map(([k, v]) => (
                                                          <div key={k}><strong>{k}:</strong> {formatDisplayValue(v)}</div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })
                                            ) : (
                                              <div className="text-xs text-gray-500 italic">No entries yet.</div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-gray-500 italic">No pets registered for this user.</p>
                              )}
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Events</h3>
                              {user.events && user.events.length > 0 ? (
                                user.events.map(event => {
                                  const ePath = `${uPath}/events/${event.id}`;
                                  return (
                                    <div key={event.id} className="border rounded-lg bg-gray-50 overflow-hidden text-xs">
                                      <div className="p-3 flex justify-between items-center">
                                        <button onClick={() => setExpandedEvents(v => ({ ...v, [ePath]: !v[ePath] }))} className="font-semibold">
                                          {expandedEvents[ePath] ? '▼' : '▶'} {event.title || event.id}
                                        </button>
                                        <div className="flex gap-2">
                                          {editMode[ePath] ? (
                                            <div className="flex gap-2">
                                              <button
                                                disabled={saving[ePath]}
                                                onClick={() => saveChanges(ePath)}
                                                className={`${btnPrimary} ${saving[ePath] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                              >
                                                {saving[ePath] ? 'Saving...' : 'Save'}
                                              </button>
                                              <button onClick={() => cancelEdit(ePath)} className={btnSecondary}>Cancel</button>
                                            </div>
                                          ) : (
                                            <button onClick={() => startEditing(ePath, event)} className={btnSecondary}>Edit</button>
                                          )}
                                          <button onClick={() => deleteItem(ePath)} className={btnDanger}>Delete</button>
                                        </div>
                                      </div>
                                      {expandedEvents[ePath] && (
                                        <div className="p-3 bg-white border-t">
                                          {editMode[ePath] ? (
                                            <textarea value={editJsonValue[ePath]} onChange={e => setEditJsonValue(v => ({ ...v, [ePath]: e.target.value }))} className="w-full h-24 font-mono p-2 border" />
                                          ) : (
                                            Object.entries(event).filter(([k]) => k !== 'id').map(([k, v]) => (
                                              <div key={k}><strong>{k}:</strong> {formatDisplayValue(v)}</div>
                                            ))
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-gray-500 italic">No events.</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            {loadingFeedback ? (
              <LoadingIndicator text="Loading Feedback..." />
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">User Feedback</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {feedback.map(item => (
                    <div key={item.id} className="p-4 border rounded-xl relative group bg-white shadow-sm">
                      <button onClick={() => deleteItem(`feedback/${item.id}`)} className={`${btnDanger} absolute top-2 right-2`}>Delete</button>
                      {Object.entries(item).map(([k, v]) => (
                        <div key={k} className="mb-1 text-sm">
                          <span className="font-bold text-gray-400 text-[10px] uppercase block leading-tight">{k}</span>
                          <span>{formatDisplayValue(v)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}