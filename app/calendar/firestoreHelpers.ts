import { db } from "../firebase";
import { MyEvent } from "./types";
import { doc, setDoc, deleteDoc, collection, onSnapshot, query } from "firebase/firestore";

// Add or update an event in Firestore
export const saveEventToFirestore = async (userUid: string, event: MyEvent) => {
  const eventRef = doc(db, "users", userUid, "events", event.id);
  await setDoc(eventRef, event);
};

// Delete an event from Firestore
export const deleteEventFromFirestore = async (userUid: string, eventId: string) => {
  const eventRef = doc(db, "users", userUid, "events", eventId);
  await deleteDoc(eventRef);
};

// Subscribe to real-time updates
export const subscribeToEvents = (userUid: string, callback: (events: MyEvent[]) => void) => {
  const q = query(collection(db, "users", userUid, "events"));
  return onSnapshot(q, (snapshot) => {
    const events: MyEvent[] = snapshot.docs.map((doc) => doc.data() as MyEvent);
    callback(events);
  });
};
