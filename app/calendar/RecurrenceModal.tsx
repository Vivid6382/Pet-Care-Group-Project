"use client";

import React, { useState } from "react";
import { RecurrenceConfig } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddImmediately: (config: RecurrenceConfig) => void;
}

const RecurrenceModal: React.FC<Props> = ({ isOpen, onClose, onAddImmediately }) => {
  const [config, setConfig] = useState<RecurrenceConfig>({
    interval: 1,
    frequency: "weekly",
    daysOfWeek: [],
    endType: "never",
    endDate: "",
    endCount: 13,
  });

  if (!isOpen) return null;

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDay = (dayIndex: number) => {
    const current = config.daysOfWeek;
    setConfig({
      ...config,
      daysOfWeek: current.includes(dayIndex)
        ? current.filter((d) => d !== dayIndex)
        : [...current, dayIndex],
    });
  };

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

        {/* Repeat every */}
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

        {/* Days of week */}
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

        {/* End type */}
        <div className="mb-6">
          <span className="text-gray-600 block mb-2">Ends</span>
          <div className="space-y-3">
            {/* Never */}
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

            {/* On date */}
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

            {/* After count */}
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

export default RecurrenceModal;
