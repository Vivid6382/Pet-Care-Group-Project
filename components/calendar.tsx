"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
interface Event {
  id: number;
  startTime: string;
  endTime: string;
  title: string;
  petName: string;
  eventType: string;
  location?: string;
  notes?: string;
}
interface DeleteConfirm {
  eventId: number;
  eventTitle: string;
  date: Date;
}


interface EventsMap {
  [key: string]: Event[];
}

// Ensuite, typez vos états

export default function PetCalendar() {
    const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);
    const [events, setEvents] = useState<EventsMap>({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('monthly');
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        petName: '',
        eventType: 'vet',
        startTime: '',
        endTime: '',
        location: '',
        notes: ''
    });

    
  

  const eventTypes = [
    { value: 'vet', label: '🏥 Vet Visit', color: 'bg-red-100 border-red-500' },
    { value: 'grooming', label: '✂️ Grooming', color: 'bg-purple-100 border-purple-500' },
    { value: 'feeding', label: '🍖 Feeding', color: 'bg-orange-100 border-orange-500' },
    { value: 'medication', label: '💊 Medication', color: 'bg-blue-100 border-blue-500' },
    { value: 'playtime', label: '🎾 Playtime', color: 'bg-green-100 border-green-500' },
    { value: 'training', label: '🎓 Training', color: 'bg-yellow-100 border-yellow-500' },
    { value: 'other', label: '📌 Other', color: 'bg-gray-100 border-gray-500' }
  ];

  const getEventColor = (type: string) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-100 border-gray-500';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getWeekDates = (date: string | number | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(date);
    monday.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d);
    }
    return weekDates;
  };

  const previousPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isToday = (day: number, month = currentDate.getMonth(), year = currentDate.getFullYear()) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number, month = currentDate.getMonth(), year = currentDate.getFullYear()) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const hasEvents = (day: number, month = currentDate.getMonth(), year = currentDate.getFullYear()) => {
    const dateStr = `${year}-${month + 1}-${day}`;
    return events[dateStr] && events[dateStr].length > 0;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return events[dateStr] || [];
  };

  const handleDateClick = (day: number | undefined, month = currentDate.getMonth(), year = currentDate.getFullYear()) => {
    setSelectedDate(new Date(year, month, day));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.petName || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in title, pet name, start time, and end time');
      return;
    }

    const dateStr = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const event = {
      id: Date.now(),
      ...newEvent
    };

    setEvents(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), event]
    }));

    setNewEvent({
      title: '',
      petName: '',
      eventType: 'vet',
      startTime: '',
      endTime: '',
      location: '',
      notes: ''
    });
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (eventId: number, date: { getFullYear: () => any; getMonth: () => number; getDate: () => any; }) => {
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    setEvents(prev => {
      const updatedEvents = { ...prev };
      updatedEvents[dateStr] = updatedEvents[dateStr].filter(e => e.id !== eventId);
      if (updatedEvents[dateStr].length === 0) {
        delete updatedEvents[dateStr];
      }
      return updatedEvents;
    });
    setDeleteConfirm(null);
  };

  const confirmDelete = (eventId: number, eventTitle: string, date: Date) => {
    setDeleteConfirm({ eventId , eventTitle, date });
  };

  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-3"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      const selected = isSelected(day);
      const hasEvent = hasEvents(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            relative p-3 text-center transition-all duration-200 rounded-lg
            ${today ? 'bg-blue-600 text-white font-bold' : ''}
            ${selected && !today ? 'bg-blue-100 font-semibold' : ''}
            ${!today && !selected ? 'hover:bg-gray-100' : ''}
          `}
        >
          {day}
          {hasEvent && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const renderWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    const timeSlots = [];
    for (let hour = 6; hour <= 22; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2 mb-2 sticky top-0 bg-white z-10">
            <div className="p-3 text-sm font-bold text-gray-600"></div>
            {weekDates.map((date, idx) => {
              const isCurrentDay = isToday(date.getDate(), date.getMonth(), date.getFullYear());
              const isSelectedDay = isSelected(date.getDate(), date.getMonth(), date.getFullYear());
              
              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(date.getDate(), date.getMonth(), date.getFullYear())}
                  className={`p-3 text-center rounded-lg transition-colors ${
                    isCurrentDay ? 'bg-blue-600 text-white font-bold' :
                    isSelectedDay ? 'bg-blue-100 font-semibold' :
                    'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs">{daysOfWeek[idx]}</div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="p-2 text-xs text-gray-500 text-right">{time}</div>
                {weekDates.map((date, idx) => {
                  const dayEvents = getEventsForDate(date);
                  const eventsAtTime = dayEvents.filter(e => e.startTime.startsWith(time.split(':')[0]));
                  
                  return (
                    <div key={idx} className="border border-gray-100 rounded p-1 min-h-[50px] relative">
                      {eventsAtTime.map(event => (
                        <div key={event.id} className={`border-l-2 p-1 rounded text-xs mb-1 ${getEventColor(event.eventType)}`}>
                          <div className="font-semibold truncate">{event.petName}</div>
                          <div className="text-gray-600 text-[10px]">{event.startTime} - {event.endTime}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-200 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Event</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.eventTitle}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(deleteConfirm.eventId, deleteConfirm.date)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left side - Calendar */}
      <div className="flex-shrink-0 w-[500px]">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Today
          </button>
          <h1 className="text-2xl font-bold text-gray-800">🐾 Pet Calendar</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousPeriod}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-2xl font-bold hover:text-blue-600 transition-colors"
              >
                {viewMode === 'monthly' 
                  ? `${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`
                  : `Week of ${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                }
              </button>
              
              {showDatePicker && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 z-20 w-80">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Select Date</label>
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Month Selector */}
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Month</label>
                      <div className="border border-gray-300 rounded-lg h-40 overflow-y-scroll">
                        {monthNames.map((month, idx) => (
                          <button
                            key={month}
                            onClick={() => {
                              const newDate = new Date(currentDate);
                              newDate.setMonth(idx);
                              setCurrentDate(newDate);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                              currentDate.getMonth() === idx ? 'bg-blue-100 font-semibold' : ''
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Year Selector */}
                    <div className="w-24">
                      <label className="text-xs text-gray-500 mb-1 block">Year</label>
                      <div className="border border-gray-300 rounded-lg h-40 overflow-y-scroll">
                        {Array.from({ length: 21 }, (_, i) => currentDate.getFullYear() - 10 + i).map(year => (
                          <button
                            key={year}
                            onClick={() => {
                              const newDate = new Date(currentDate);
                              newDate.setFullYear(year);
                              setCurrentDate(newDate);
                            }}
                            className={`w-full px-3 py-2 text-center hover:bg-blue-50 transition-colors ${
                              currentDate.getFullYear() === year ? 'bg-blue-100 font-semibold' : ''
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedDate(new Date(currentDate));
                      setShowDatePicker(false);
                    }}
                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Go to Date
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={nextPeriod}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {viewMode === 'monthly' && (
            <>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-bold text-gray-600 p-3">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {renderMonthlyView()}
              </div>
            </>
          )}

          {viewMode === 'weekly' && renderWeeklyView()}
        </div>
      </div>

      {/* Right side - Event Details */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pet Events</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'weekly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Pet Event
            </button>
          </div>

          {showAddEvent && (
            <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">New Pet Event</h4>
                <button onClick={() => setShowAddEvent(false)}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value + 'T00:00:00');
                      setSelectedDate(newDate);
                      setCurrentDate(newDate);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pet name *"
                  value={newEvent.petName}
                  onChange={(e) => setNewEvent({...newEvent, petName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Event title *"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Notes"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                />
                <button
                  onClick={handleAddEvent}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Save Event
                </button>
              </div>
            </div>
          )}

          {selectedEvents.length > 0 ? (
            <div className="space-y-6">
              {selectedEvents.map((event, index) => (
                <div key={event.id} className={`border-l-4 pl-6 py-2 relative ${getEventColor(event.eventType)}`}>
                  <button
                    onClick={() => confirmDelete(event.id, event.title, selectedDate)}
                    className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex gap-6">
                    <div className="text-sm font-semibold text-gray-600 w-20">
                      {event.startTime}
                      <div className="text-xs text-gray-400 mt-1">
                        {event.endTime}
                      </div>
                    </div>
                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {eventTypes.find(t => t.value === event.eventType)?.label.split(' ')[0]}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800">
                          {event.title}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-500 w-24">Pet:</span>
                          <span className="text-gray-800 font-semibold">{event.petName}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">Type:</span>
                          <span className="text-gray-800">
                            {eventTypes.find(t => t.value === event.eventType)?.label}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex">
                            <span className="text-gray-500 w-24">Location:</span>
                            <span className="text-gray-800">{event.location}</span>
                          </div>
                        )}
                        {event.notes && (
                          <div className="flex">
                            <span className="text-gray-500 w-24">Notes:</span>
                            <span className="text-gray-800">{event.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < selectedEvents.length - 1 && (
                    <div className="mt-6 border-b border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🐾</div>
              <p>No pet events scheduled for this date</p>
              <p className="text-sm mt-2">Click "Add Pet Event" to schedule something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}