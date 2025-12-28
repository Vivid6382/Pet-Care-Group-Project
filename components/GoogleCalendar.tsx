"use client";
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { EventInput } from "@fullcalendar/core";

// =========================================================================
// 0. TYPE DEFINITIONS
// =========================================================================

interface RecurrenceConfig {
  interval: number | "";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  daysOfWeek: number[]; // 0=Sun, 1=Mon...
  endType: "never" | "date" | "count";
  endDate: string;
  endCount: number | "";
}

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImmediately: (config: RecurrenceConfig) => void;
}

interface FormState {
  title: string;
  date: string;
  type: "dog" | "cat";
  repeatType: "none" | "daily" | "weekly" | "custom";
  repeatCount: number | "";
}

// Extended Event Interface to support RRule
interface MyEvent extends EventInput {
  id: string;
  title: string;
  rrule?: {
    freq: string;
    interval: number;
    dtstart: string;
    until?: string;
    count?: number;
    byweekday?: string[] | number[]; // Updated to accept strings ('mo', 'tu')
  };
  start?: string;
  allDay: boolean;
  backgroundColor: string;
  extendedProps: {
    type: "dog" | "cat";
    summary: string;
  };
}

// =========================================================================
// 1. MODAL COMPONENT
// =========================================================================
const RecurrenceModal: React.FC<RecurrenceModalProps> = ({ isOpen, onClose, onAddImmediately }) => {
  const [config, setConfig] = useState<RecurrenceConfig>({
    interval: 1,
    frequency: "weekly",
    daysOfWeek: [],
    endType: "never",
    endDate: "",
    endCount: 13,
  });

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    const current = config.daysOfWeek;
    setConfig({
      ...config,
      daysOfWeek: current.includes(dayIndex)
        ? current.filter((d) => d !== dayIndex)
        : [...current, dayIndex],
    });
  };

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleConfirm = () => {
    if (config.frequency === "weekly" && config.daysOfWeek.length === 0) {
      alert("Please select at least one day of the week!");
      return;
    }
    if (config.endType === "date" && !config.endDate) {
      alert("Please select an end date!");
      return;
    }
    onAddImmediately(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 text-sm font-sans">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Custom Recurrence</h3>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-600">Repeat every</span>
          <input
            type="number"
            min="1"
            className="w-16 p-2 border rounded text-center"
            value={config.interval}
            onChange={(e) => setConfig({ ...config, interval: e.target.value === "" ? "" : parseInt(e.target.value) })}
          />
          <select
            className="p-2 border rounded flex-1"
            value={config.frequency}
            onChange={(e) => setConfig({ ...config, frequency: e.target.value as RecurrenceConfig["frequency"] })}
          >
            <option value="daily">day</option>
            <option value="weekly">week</option>
            <option value="monthly">month</option>
            <option value="yearly">year</option>
          </select>
        </div>

        {config.frequency === "weekly" && (
          <div className="mb-6">
            <span className="text-gray-600 block mb-2">Repeat on</span>
            <div className="flex justify-between">
              {daysLabels.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    config.daysOfWeek.includes(idx)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <span className="text-gray-600 block mb-2">Ends</span>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer p-1 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="endType"
                checked={config.endType === "never"}
                onChange={() => setConfig({ ...config, endType: "never" })}
                className="mr-2"
              />
              <span>Never</span>
            </label>
            <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="endType"
                  checked={config.endType === "date"}
                  onChange={() => setConfig({ ...config, endType: "date" })}
                  className="mr-2"
                />
                <span>On date</span>
              </label>
              <input
                type="date"
                className="border p-1 rounded w-36 text-gray-600"
                disabled={config.endType !== "date"}
                value={config.endDate}
                onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="endType"
                  checked={config.endType === "count"}
                  onChange={() => setConfig({ ...config, endType: "count" })}
                  className="mr-2"
                />
                <span>After</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-16 p-1 border rounded text-center"
                  disabled={config.endType !== "count"}
                  value={config.endCount}
                  onChange={(e) => setConfig({ ...config, endCount: e.target.value === "" ? "" : parseInt(e.target.value) })}
                />
                <span>occurrences</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-sm"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. MAIN COMPONENT
// =========================================================================
export default function Calendar() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "dog",
    repeatType: "none",
    repeatCount: 1,
  });

  const handleAdd = (customConfig: RecurrenceConfig | null = null) => {
    if (!form.title || !form.date) return alert("Please enter a title and start date!");

    const color = form.type === "dog" ? "#3B82F6" : "#F59E0B";
    const baseEvent = {
      id: String(Math.random()),
      title: form.title,
      allDay: true,
      backgroundColor: color,
    };

    let newEvent: MyEvent;

    // 1. SIMPLE RECURRENCE (Daily/Weekly from dropdown)
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
    // 2. CUSTOM RECURRENCE (From Modal)
    else if (customConfig) {
      const interval = customConfig.interval === "" ? 1 : customConfig.interval;
      
      const rruleConfig: any = {
        freq: customConfig.frequency,
        interval: interval,
        dtstart: form.date,
      };

      // ---------------------------------------------------------
      // BUG FIX: Map integer days to RRule string codes
      // ---------------------------------------------------------
      if (customConfig.frequency === "weekly" && customConfig.daysOfWeek.length > 0) {
        // Your UI: 0=Sun, 1=Mon, 2=Tue...
        // RRule Codes: 'su', 'mo', 'tu'...
        const dayMap = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        
        // Convert [1] -> ['mo']
        rruleConfig.byweekday = customConfig.daysOfWeek.map((index) => dayMap[index]);
      }

      // Handle Endings
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
    // 3. NO REPEAT
    else {
      newEvent = {
        ...baseEvent,
        start: form.date,
        extendedProps: { type: form.type, summary: "One-time event" },
      };
    }

    setEvents((prev) => [...prev, newEvent]);
    setForm({ ...form, title: "", repeatType: "none", repeatCount: 1 });
  };

  const deleteEvent = (idToDelete: string) => {
    if (window.confirm("Are you sure you want to delete this event series?")) {
      setEvents((prev) => prev.filter((e) => e.id !== idToDelete));
    }
  };

  return (
    <div className="flex h-screen p-4 gap-4 bg-gray-100 font-sans text-black">
      <RecurrenceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setForm((prev) => ({ ...prev, repeatType: "none" }));
        }}
        onAddImmediately={(cfg) => handleAdd(cfg)}
      />

      {/* --- LEFT COLUMN: INPUT FORM --- */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow border flex flex-col gap-4 h-full overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800">Pet Calendar</h2>

        <div className="space-y-4 bg-gray-50 p-3 rounded border">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded text-sm bg-white mt-1"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="flex gap-4 text-sm font-medium">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={form.type === "dog"}
                onChange={() => setForm({ ...form, type: "dog" })}
                className="mr-1"
              />{" "}
              🐶 Dog
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={form.type === "cat"}
                onChange={() => setForm({ ...form, type: "cat" })}
                className="mr-1"
              />{" "}
              🐱 Cat
            </label>
          </div>

          <hr className="border-gray-200" />

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Event Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm mb-2 mt-1"
              placeholder="e.g., Rabies Vaccination..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="flex gap-2 mb-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-bold">Repeat</label>
                <select
                  className="w-full p-2 border rounded text-sm mt-1"
                  value={form.repeatType}
                  onChange={(e) => {
                    const val = e.target.value as FormState["repeatType"];
                    setForm({ ...form, repeatType: val });
                    if (val === "custom") {
                      if (!form.date) {
                        alert("Please select a start date first!");
                        setForm((prev) => ({ ...prev, repeatType: "none" }));
                        return;
                      }
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom...</option>
                </select>
              </div>
              {(form.repeatType === "daily" || form.repeatType === "weekly") && (
                <div className="w-20">
                  <label className="text-xs text-gray-500 font-bold">Times</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded text-sm mt-1"
                    value={form.repeatCount}
                    onChange={(e) =>
                      setForm({ ...form, repeatCount: e.target.value === "" ? "" : parseInt(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>

            {form.repeatType !== "custom" && (
              <button
                onClick={() => handleAdd()}
                className="w-full bg-blue-600 text-white p-2 rounded font-bold shadow hover:bg-blue-700 transition"
              >
                + Add Event
              </button>
            )}
          </div>
        </div>

        {/* --- EVENTS LIST --- */}
        <div className="flex-1 overflow-auto border-t pt-2">
          <h3 className="font-semibold text-gray-500 text-sm mb-2">Event Series ({events.length})</h3>
          {events.length === 0 ? (
            <p className="text-center text-gray-400 text-xs mt-4">No events added yet</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="p-3 border rounded flex justify-between bg-white shadow-sm text-sm items-center hover:bg-blue-50 transition group"
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      {event.title}
                    </div>
                    <span className="text-xs text-gray-500">
                      {event.rrule 
                        ? `Starts: ${event.rrule.dtstart}` 
                        : `Date: ${event.start}`}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {event.extendedProps.summary}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                    title="Delete series"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- RIGHT COLUMN: CALENDAR --- */}
      <div className="w-3/4 flex flex-col gap-4 h-full">
        <div className="flex-1 bg-white p-2 rounded-lg shadow border overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ start: "prev,next today", center: "title", end: "dayGridMonth" }}
            height="100%"
            events={events}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm h-48 overflow-y-auto">
          <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
             💡 Pet Care Schedule Suggestions
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
             <div>
               <h4 className="font-bold text-gray-700 mb-2 flex items-center">🐶 For Dogs</h4>
               <ul className="list-disc list-inside space-y-1 text-gray-600">
                 <li><span className="font-medium text-gray-800">Vaccination:</span> Every <span className="text-blue-600 font-bold">1 year</span></li>
                 <li><span className="font-medium text-gray-800">Deworming:</span> Every <span className="text-blue-600 font-bold">3-6 months</span></li>
               </ul>
             </div>
             <div>
               <h4 className="font-bold text-gray-700 mb-2 flex items-center">🐱 For Cats</h4>
               <ul className="list-disc list-inside space-y-1 text-gray-600">
                 <li><span className="font-medium text-gray-800">Vaccination:</span> Every <span className="text-orange-500 font-bold">1 year</span></li>
                 <li><span className="font-medium text-gray-800">Deworming:</span> Every <span className="text-orange-500 font-bold">3 months</span></li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}