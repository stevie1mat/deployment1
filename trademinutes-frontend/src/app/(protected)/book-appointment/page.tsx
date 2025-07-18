"use client";

import { useState } from "react";
import { format } from "date-fns";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function BookAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const monthDates = Array.from(
    { length: endOfMonth.getDate() },
    (_, i) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  const times = ["10:00 AM", "11:00 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <ProtectedLayout>
      <div className="flex bg-white rounded-xl shadow-xl p-6">
        {/* Sidebar Summary */}
        <div className="w-1/3 pr-8 border-r border-gray-200">
          <div className="flex flex-col justify-center items-center text-center h-full">
            <img
              src="https://cdn.pixabay.com/photo/2020/09/29/13/27/woman-5612838_1280.jpg"
              alt="user"
              className="w-60 h-60 rounded-full mb-3 object-cover"
            />
            <h2 className="text-lg font-semibold">Fatima Sy</h2>
            <p className="text-gray-500 text-sm">Client Check-in</p>
            <p className="text-gray-400 text-sm mt-2">🕒 30 min</p>
            <p className="text-gray-400 text-sm">📹 Zoom</p>
          </div>
        </div>

        {/* Main Calendar + Time Picker */}
        <div className="w-2/3 px-8">
          <h2 className="text-xl font-semibold mb-4">Select a Date & Time</h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={goToPreviousMonth}
              className="text-blue-600 text-xl"
            >
              ←
            </button>
            <p className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </p>
            <button onClick={goToNextMonth} className="text-blue-600 text-xl">
              →
            </button>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm text-gray-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {monthDates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`py-2 rounded-lg font-medium ${
                  selectedDate?.toDateString() === date.toDateString()
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                {date.getDate()}
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div>
            <p className="font-medium mb-2">
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d")
                : "Select a date"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`border px-4 py-2 rounded-md font-medium ${
                    selectedTime === time
                      ? "bg-gray-700 text-white"
                      : "text-blue-600 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {selectedTime && (
              <div className="mt-4 text-right">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
