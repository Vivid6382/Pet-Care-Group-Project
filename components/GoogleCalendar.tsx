"use client";
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

// =========================================================================
// 0. TYPE DEFINITIONS
// =========================================================================

// Cấu hình lặp lại trong Modal
interface RecurrenceConfig {
  interval: number | "";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  daysOfWeek: number[];
  endType: "never" | "date" | "count";
  endDate: string;
  endCount: number | "";
}

// Props cho Modal
interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImmediately: (config: RecurrenceConfig) => void;
}

// State của Form chính
interface FormState {
  title: string;
  date: string;
  type: "dog" | "cat";
  repeatType: "none" | "daily" | "weekly" | "custom";
  repeatCount: number | "";
}

// Kiểu dữ liệu sự kiện mở rộng từ EventInput của FullCalendar
interface MyEvent extends EventInput {
  id: string;
  groupId: string;
  title: string;
  start: string;
  allDay: boolean;
  backgroundColor: string;
  count?: number; // Thuộc tính phụ trợ để đếm số lượng hiển thị bên trái
}

// =========================================================================
// 1. COMPONENT MODAL (ĐÃ SỬA VALIDATION)
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

  const daysLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // --- SỬA ĐỔI: Hàm kiểm tra hợp lệ trước khi thêm ---
  const handleConfirm = () => {
    // 1. Kiểm tra nếu chọn Weekly mà chưa chọn ngày nào
    if (config.frequency === "weekly" && config.daysOfWeek.length === 0) {
        alert("Vui lòng chọn ít nhất một ngày trong tuần (ví dụ: T2, T5)!");
        return;
    }
    // 2. Kiểm tra nếu chọn kết thúc vào ngày cụ thể mà chưa nhập ngày
    if (config.endType === "date" && !config.endDate) {
        alert("Vui lòng chọn ngày kết thúc!");
        return;
    }

    // Nếu hợp lệ thì gọi hàm thêm và đóng modal
    onAddImmediately(config);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 text-sm font-sans animate-fade-in-down">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Lặp lại tùy chỉnh</h3>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-600">Lặp lại mỗi</span>
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
            <option value="daily">ngày</option>
            <option value="weekly">tuần</option>
            <option value="monthly">tháng</option>
            <option value="yearly">năm</option>
          </select>
        </div>

        {config.frequency === "weekly" && (
          <div className="mb-6">
            <span className="text-gray-600 block mb-2">Lặp lại vào</span>
            <div className="flex justify-between">
              {daysLabels.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
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
          <span className="text-gray-600 block mb-2">Kết thúc</span>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer p-1 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="endType"
                checked={config.endType === "never"}
                onChange={() => setConfig({ ...config, endType: "never" })}
                className="mr-2"
              />
              <span>Không bao giờ</span>
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
                <span>Vào ngày</span>
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
                <span>Sau</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-16 p-1 border rounded text-center"
                  disabled={config.endType !== "count"}
                  value={config.endCount}
                  onChange={(e) => setConfig({ ...config, endCount: e.target.value === "" ? "" : parseInt(e.target.value) })}
                />
                <span>lần</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-sm"
          >
            Thêm sự kiện
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. COMPONENT CHÍNH (ĐÃ SỬA VÒNG LẶP)
// =========================================================================
export default function Calendar() {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Khởi tạo form ---
  const [form, setForm] = useState<FormState>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "dog",
    repeatType: "none",
    repeatCount: 1,
  });

  // --- LOGIC TẠO SỰ KIỆN ---
  const generateEventsFromConfig = (
    config: RecurrenceConfig,
    baseTitle: string,
    baseDate: string,
    groupId: string
  ): MyEvent[] => {
    const generatedEvents: MyEvent[] = [];
    let cycleCount = 0;

    // Giới hạn thời gian tối đa để tránh vòng lặp vô tận (2 năm)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    
    const interval = (config.interval === "" ? 1 : config.interval) || 1;
    const startDateObj = new Date(baseDate);

    if (config.frequency === "weekly") {
      let currentWeekStart = new Date(startDateObj);
      const dayOfWeek = currentWeekStart.getDay();
      currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);

      let hasStarted = false;

      while (true) {
        // --- SỬA LỖI QUAN TRỌNG: Điều kiện dừng tuyệt đối ---
        if (currentWeekStart > maxDate) break;
        // ----------------------------------------------------

        if (config.endType === "count" && cycleCount >= ((config.endCount === "" ? 1 : config.endCount) || 1)) break;
        if (config.endType === "date" && config.endDate && currentWeekStart > new Date(config.endDate)) break;
        // Kiểm tra thêm maxDate cho logic never
        if (config.endType === "never" && currentWeekStart > maxDate) break;

        let eventAddedInThisCycle = false;

        if (config.daysOfWeek && config.daysOfWeek.length > 0) {
          const sortedDays = [...config.daysOfWeek].sort((a, b) => a - b);

          for (let dayIndex of sortedDays) {
            let targetDate = new Date(currentWeekStart);
            targetDate.setDate(currentWeekStart.getDate() + dayIndex);

            // Bỏ qua các ngày trong quá khứ so với ngày bắt đầu user chọn
            if (targetDate < startDateObj) continue;

            if (config.endType === "date" && config.endDate && targetDate > new Date(config.endDate)) break;
            if (config.endType === "never" && targetDate > maxDate) break;

            generatedEvents.push({
              id: String(Math.random()),
              groupId: groupId,
              title: baseTitle,
              start: targetDate.toISOString().split("T")[0],
              allDay: true,
              backgroundColor: form.type === "dog" ? "#3B82F6" : "#F59E0B",
            });
            eventAddedInThisCycle = true;
          }
        }

        if (eventAddedInThisCycle) {
          hasStarted = true;
          cycleCount++;
        }

        // Logic tăng thời gian
        if (hasStarted) {
          currentWeekStart.setDate(currentWeekStart.getDate() + interval * 7);
        } else {
          // Nếu chưa tìm thấy sự kiện đầu tiên (do chưa khớp thứ), chỉ tăng 1 tuần để tìm tiếp
          currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }
      }
    } else {
      // Logic cho Daily, Monthly, Yearly (Ít lỗi hơn nhưng vẫn thêm maxDate cho an toàn)
      let currentDate = new Date(startDateObj);
      while (true) {
        if (currentDate > maxDate) break; // An toàn

        if (config.endType === "count" && cycleCount >= ((config.endCount === "" ? 1 : config.endCount) || 1)) break;
        if (config.endType === "date" && config.endDate && currentDate > new Date(config.endDate)) break;
        if (config.endType === "never" && currentDate > maxDate) break;

        generatedEvents.push({
          id: String(Math.random()),
          groupId: groupId,
          title: baseTitle,
          start: currentDate.toISOString().split("T")[0],
          allDay: true,
          backgroundColor: form.type === "dog" ? "#3B82F6" : "#F59E0B",
        });

        cycleCount++;

        if (config.frequency === "daily") currentDate.setDate(currentDate.getDate() + interval);
        else if (config.frequency === "monthly") currentDate.setMonth(currentDate.getMonth() + interval);
        else if (config.frequency === "yearly") currentDate.setFullYear(currentDate.getFullYear() + interval);
      }
    }
    return generatedEvents;
  };

  const handleAdd = (customConfig: RecurrenceConfig | null = null) => {
    if (!form.title || !form.date) return alert("Vui lòng nhập Tiêu đề và Ngày bắt đầu!");

    const groupId = String(Date.now());
    let newEvents: MyEvent[] = [];

    if (customConfig) {
      newEvents = generateEventsFromConfig(customConfig, form.title, form.date, groupId);
    } else {
      const count = form.repeatType === "none" ? 1 : (typeof form.repeatCount === 'number' ? form.repeatCount : 1);
      const baseDate = new Date(form.date);
      for (let i = 0; i < count; i++) {
        const d = new Date(baseDate);
        if (form.repeatType === "daily") d.setDate(d.getDate() + i);
        if (form.repeatType === "weekly") d.setDate(d.getDate() + i * 7);
        newEvents.push({
          id: String(Math.random()),
          groupId: groupId,
          title: form.repeatType !== "none" ? `${form.title}` : form.title,
          start: d.toISOString().split("T")[0],
          allDay: true,
          backgroundColor: form.type === "dog" ? "#3B82F6" : "#F59E0B",
        });
      }
    }
    setEvents((prev) => [...prev, ...newEvents]);
    // Reset form nhưng giữ lại ngày vừa chọn để tiện nhập tiếp nếu cần
    setForm({ ...form, title: "", repeatType: "none", repeatCount: 1 });
  };

  const deleteGroup = (groupIdToDelete: string) => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sự kiện trong nhóm này?")) {
      setEvents((prev) => prev.filter((e) => e.groupId !== groupIdToDelete));
    }
  };

  const groupedEvents = Object.values(
    events.reduce<Record<string, MyEvent>>((acc, curr) => {
      if (!acc[curr.groupId]) {
        acc[curr.groupId] = { ...curr, count: 0 };
      }
      if (typeof acc[curr.groupId].count === 'number') {
         acc[curr.groupId].count! += 1;
      }
      return acc;
    }, {})
  );

  return (
    <div className="flex h-screen p-4 gap-4 bg-gray-100 font-sans">
      <RecurrenceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Nếu hủy modal, reset select về 'none'
          setForm((prev) => ({ ...prev, repeatType: "none" }));
        }}
        onAddImmediately={(cfg) => handleAdd(cfg)}
      />

      {/* --- CỘT TRÁI: FORM NHẬP LIỆU --- */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow border flex flex-col gap-4 h-full">
        <h2 className="text-xl font-bold text-gray-800">Pet Calendar</h2>

        <div className="space-y-4 bg-gray-50 p-3 rounded border">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Ngày bắt đầu</label>
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
            <label className="text-xs font-bold text-gray-500 uppercase">Tên sự kiện</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm mb-2 mt-1"
              placeholder="Ví dụ: Tiêm phòng dại..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="flex gap-2 mb-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-bold">Lặp lại</label>
                <select
                  className="w-full p-2 border rounded text-sm mt-1"
                  value={form.repeatType}
                  onChange={(e) => {
                    const val = e.target.value as FormState["repeatType"];
                    setForm({ ...form, repeatType: val });
                    if (val === "custom") {
                      if (!form.date) {
                        alert("Vui lòng chọn ngày bắt đầu trước!");
                        setForm((prev) => ({ ...prev, repeatType: "none" }));
                        return;
                      }
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <option value="none">Không lặp</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="custom">Tùy chỉnh...</option>
                </select>
              </div>
              {(form.repeatType === "daily" || form.repeatType === "weekly") && (
                <div className="w-20">
                  <label className="text-xs text-gray-500 font-bold">Số lần</label>
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
                + Thêm sự kiện
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto border-t pt-2">
          <h3 className="font-semibold text-gray-500 text-sm mb-2">Danh sách nhóm ({groupedEvents.length})</h3>
          {groupedEvents.length === 0 ? (
            <p className="text-center text-gray-400 text-xs mt-4">Chưa có sự kiện nào</p>
          ) : (
            <ul className="space-y-2">
              {groupedEvents
                .sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime())
                .map((group) => (
                  <li
                    key={group.groupId}
                    className="p-3 border rounded flex justify-between bg-white shadow-sm text-sm items-center hover:bg-blue-50 transition group"
                  >
                    <div className="flex flex-col">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        {group.title}
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full border border-blue-200">
                          x{group.count}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Bắt đầu: {new Date(group.start as string).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteGroup(group.groupId)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                      title="Xóa tất cả"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- CỘT PHẢI: LỊCH + GỢI Ý --- */}
      <div className="w-3/4 flex flex-col gap-4 h-full">
        {/* PHẦN LỊCH */}
        <div className="flex-1 bg-white p-2 rounded-lg shadow border overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ start: "prev,next today", center: "title", end: "dayGridMonth" }}
            height="100%"
            events={events}
          />
        </div>

        {/* PHẦN GỢI Ý LỊCH TRÌNH */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm h-48 overflow-y-auto">
          <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
            💡 Gợi ý lịch trình chăm sóc thú cưng
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            {/* Gợi ý cho Chó */}
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center">🐶 Dành cho Chó</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">Tiêm phòng (Vaccine):</span> Định kỳ{" "}
                  <span className="text-blue-600 font-bold">1 năm/lần</span> (nhắc lại hàng năm).
                </li>
                <li>
                  <span className="font-medium text-gray-800">Tẩy giun:</span> Mỗi{" "}
                  <span className="text-blue-600 font-bold">3-6 tháng/lần</span> tùy môi trường sống.
                </li>
                <li>
                  <span className="font-medium text-gray-800">Spa/Tắm:</span> Khuyến nghị{" "}
                  <span className="text-blue-600 font-bold">1-2 tuần/lần</span> để giữ vệ sinh.
                </li>
              </ul>
            </div>
            {/* Gợi ý cho Mèo */}
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center">🐱 Dành cho Mèo</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">Tiêm phòng (Vaccine):</span> Định kỳ{" "}
                  <span className="text-orange-500 font-bold">1 năm/lần</span> (bệnh giảm bạch cầu, dại).
                </li>
                <li>
                  <span className="font-medium text-gray-800">Tẩy giun:</span> Mỗi{" "}
                  <span className="text-orange-500 font-bold">3 tháng/lần</span> nếu mèo ăn thịt sống.
                </li>
                <li>
                  <span className="font-medium text-gray-800">Spa/Cắt móng:</span> Khuyến nghị{" "}
                  <span className="text-orange-500 font-bold">1 tháng/lần</span> (Mèo tắm ít hơn chó).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}