"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RecurrenceModal from "./RecurrenceModal";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import { MyEvent, FormState, RecurrenceConfig } from "./types";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { saveEventToFirestore, deleteEventFromFirestore, subscribeToEvents } from "./firestoreHelpers";

export default function CalendarPage() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "dog",
    repeatType: "none",
    repeatCount: 1,
  });
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserUid(user.uid);
      else setUserUid(null);
    });
    return () => unsubscribe();
  }, []);


  const handleAdd = async (customConfig: RecurrenceConfig | null = null) => {
  // check if the user logged in
    if (!userUid) return alert("You must be logged in to add events.");
  // --- 1. Validate basic fields ---
    if (!form.title || !form.date) {
      alert("Please enter a title and start date!");
      return;
    }

    // --- 2. Determine color based on pet type ---
    const color = form.type === "dog" ? "#3B82F6" : "#F59E0B";

    // --- 3. Base event object ---
    const baseEvent = {
      id: String(Math.random()),
      title: form.title,
      allDay: true,
      backgroundColor: color,
    };

    let newEvent: MyEvent;

    // --- 4. Simple recurrence from form (daily/weekly) ---
    if (!customConfig && form.repeatType !== "none" && form.repeatType !== "custom") {
      const count = typeof form.repeatCount === "number" ? form.repeatCount : 1;

      newEvent = {
        ...baseEvent,
        rrule: {
          freq: form.repeatType,
          interval: 1,
          dtstart: form.date,
          count: count > 0 ? count : undefined,
        },
        extendedProps: { type: form.type, summary: `Repeats ${form.repeatType}` },
      };
    }
    // --- 5. Custom recurrence from modal ---
    else if (customConfig) {
      // Ensure interval is a number
      const interval = customConfig.interval === "" ? 1 : customConfig.interval;

      // Base rrule
      const rruleConfig: any = {
        freq: customConfig.frequency, // 'daily' | 'weekly' | 'monthly' | 'yearly'
        interval,
        dtstart: form.date, // must be YYYY-MM-DD
      };

      // Weekly custom days
      if (customConfig.frequency === "weekly" && customConfig.daysOfWeek.length > 0) {
        const dayMap = ["su", "mo", "tu", "we", "th", "fr", "sa"];
        rruleConfig.byweekday = customConfig.daysOfWeek.map((idx) => dayMap[idx]);
      }

      // Handle end types
      if (customConfig.endType === "date" && customConfig.endDate) {
        rruleConfig.until = customConfig.endDate;
      } else if (customConfig.endType === "count" && customConfig.endCount) {
        rruleConfig.count = customConfig.endCount;
      }

      newEvent = {
        ...baseEvent,
        rrule: rruleConfig,
        extendedProps: { type: form.type, summary: `Custom ${customConfig.frequency} rule` },
      };
    }
    // --- 6. No repeat event ---
    else {
      newEvent = {
        ...baseEvent,
        start: form.date,
        extendedProps: { type: form.type, summary: "One-time event" },
      };
    }

    // --- 7. Add new event to state ---
    setEvents((prev) => [...prev, newEvent]);

    // --- 8. Reset form fields ---
    setForm({ ...form, title: "", repeatType: "none", repeatCount: 1 });

    // Save to Firestore
    await saveEventToFirestore(userUid, newEvent);

  // Reset form
  setForm({ ...form, title: "", repeatType: "none", repeatCount: 1 });  
  };

    const deleteEvent = async (id: string) => {
      if (!userUid) return;
      if (window.confirm("Are you sure you want to delete this event series?")) {
        // Remove from Firestore
        await deleteEventFromFirestore(userUid, id);
        // Remove from local state so UI updates immediately
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    };


  useEffect(() => {
    if (!userUid) return;
    const unsubscribe = subscribeToEvents(userUid, setEvents);
    return () => unsubscribe();
  }, [userUid]);

  
  return (
    <div>
      <NavBar />

      <div>
        <ul className="bluewrap">
          <li>
            <h1 className="text-white">Never miss a moment</h1>
          </li>
        </ul>
      </div>

      <div className="flex w-full justify-center p-5 bg-blue-100">
        <div className="flex w-full max-w-6xl h-screen p-4 gap-4 bg-gray-100 font-sans text-black">
          {/* Recurrence Modal */}
          <RecurrenceModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setForm((prev) => ({ ...prev, repeatType: "none" }));
            }}
            onAddImmediately={(cfg) => handleAdd(cfg)}
          />

          {/* Left Column: Form + Event List */}
          <LeftColumn
            form={form}
            setForm={setForm}
            events={events}
            handleAdd={handleAdd}
            deleteEvent={deleteEvent}
            openModal={() => setIsModalOpen(true)}
          />

          {/* Right Column: Calendar + Suggestions */}
          <RightColumn events={events} />
        </div>
      </div>

      <Footer />
    </div>
  );

}
