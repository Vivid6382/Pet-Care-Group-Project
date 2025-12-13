"use client";

export default function GoogleCalendar() {
  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=petcare.usth%40gmail.com&ctz=Asia%2FHo_Chi_Minh"
        style={{ border: 0 }}
        width="100%"
        height="700"
        loading="lazy"
      />
    </div>
  );
}
