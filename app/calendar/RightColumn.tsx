// app/calendar/RightColumn.tsx
"use client";

import React from "react";
import { MyEvent } from "./types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";

interface Props {
  events: MyEvent[];
}

const RightColumn: React.FC<Props> = ({ events }) => {
  return (
    <div className="w-3/4 flex flex-col gap-4 h-full">
      {/* --- Calendar --- */}
        <div className="flex-1 bg-white p-2 rounded-lg shadow border overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ start: "prev,next today", center: "title", end: "dayGridMonth" }}
            height="100%"
            events={events}
          />
        </div>

      {/* --- Suggestions Panel --- */}
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
  );
};

export default RightColumn;
