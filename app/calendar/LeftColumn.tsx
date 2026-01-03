// app/calendar/LeftColumn.tsx
"use client";

import React from "react";
import { FormState, RecurrenceConfig, MyEvent } from "./types";

interface Props {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  events: MyEvent[];
  handleAdd: (customConfig?: RecurrenceConfig) => void;
  deleteEvent: (id: string) => void;
  openModal: () => void;
}

const LeftColumn: React.FC<Props> = ({ form, setForm, events, handleAdd, deleteEvent, openModal }) => {
  return (
    <div className="w-1/4 flex flex-col gap-4 h-full">
      {/* --- Form --- */}
      <div className="bg-white p-4 rounded-lg shadow border flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">Pet Calendar</h2>
        <div className="space-y-4 bg-gray-50 p-3 rounded border">
          {/* Start Date */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded text-sm bg-white mt-1"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {/* Pet Type */}
          <div className="flex gap-4 text-sm font-medium">
            <label className="flex items-center cursor-pointer">
              <input type="radio" checked={form.type === "dog"} onChange={() => setForm({ ...form, type: "dog" })} className="mr-1" /> 🐶 Dog
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" checked={form.type === "cat"} onChange={() => setForm({ ...form, type: "cat" })} className="mr-1" /> 🐱 Cat
            </label>
          </div>

          {/* Event Title */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Event Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm mb-2 mt-1"
              placeholder="e.g., Rabies Vaccination..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Repeat Selector */}
            <div className="flex gap-2 mb-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-bold">Repeat</label>
                <select
                  className="w-full p-2 border rounded text-sm mt-1"
                  value={form.repeatType}
                  onChange={(e) => {
                    const val = e.target.value as FormState["repeatType"];
                    setForm({ ...form, repeatType: val });
                    if (val === "custom") openModal();
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
                    onChange={(e) => setForm({ ...form, repeatCount: e.target.value === "" ? "" : parseInt(e.target.value) })}
                  />
                </div>
              )}
            </div>

            {form.repeatType !== "custom" && (
              <button onClick={() => handleAdd()} className="w-full bg-blue-600 text-white p-2 rounded font-bold shadow hover:bg-blue-700 transition">
                + Add Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Event List --- */}
      <div className="flex-1 overflow-auto border-t pt-2 bg-white p-3 rounded-lg shadow border">
        <h3 className="font-semibold text-gray-500 text-sm mb-2">Event Series ({events.length})</h3>
        {events.length === 0 ? (
          <p className="text-center text-gray-400 text-xs mt-4">No events added yet</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="p-3 border rounded flex justify-between bg-white shadow-sm text-sm items-center hover:bg-blue-50 transition group">
                <div className="flex flex-col">
                  <div className="font-bold text-gray-800 flex items-center gap-2">{event.title}</div>
                  <span className="text-xs text-gray-500">{event.rrule ? `Starts: ${event.rrule.dtstart}` : `Date: ${event.start}`}</span>
                  <span className="text-[10px] text-blue-600 font-medium">{event.extendedProps.summary}</span>
                </div>
                <button onClick={() => deleteEvent(event.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition" title="Delete series">
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeftColumn;
