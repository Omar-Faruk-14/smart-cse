"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

interface Slot {
  startHour: string;
  startMinute: string;
  startPeriod: "AM" | "PM";
  endHour: string;
  endMinute: string;
  endPeriod: "AM" | "PM";
  courseId: string;
}

interface DayRoutine {
  day: string;
  slots: Slot[];
}

interface Routine {
  _id: string;
  semester: string;
  routines: DayRoutine[];
  updatedAt: string;
}

export default function DynamicSchedulePage() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://smart-cse-server-eta.vercel.app";

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch(`${apiUrl}/routines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoutines(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchRoutines();
  }, [session, apiUrl]);

  const studentRoutine = routines.find(r => String(r.semester) === String(user?.semester));
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"];

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (!studentRoutine)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold italic uppercase text-gray-400">
          No Routine Found
        </h2>
        <p className="text-sm text-gray-400 mt-1 italic">
          Contact your department for semester {user?.semester} schedule.
        </p>
      </div>
    );

  const dayRoutine = studentRoutine.routines.find(d => d.day === selectedDay);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-black italic uppercase">
          Semester {user?.semester} Routine
        </h1>
        <p className="text-sm mt-2 text-gray-300">
          Last updated:{" "}
          {studentRoutine.updatedAt
            ? new Date(studentRoutine.updatedAt).toLocaleDateString()
            : "Recently"}
        </p>
      </Card>

      {/* Day Selector */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-full font-semibold uppercase transition-all ${
              selectedDay === day
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Routine Slots */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase italic text-slate-700">
          {selectedDay} Schedule
        </h2>

        {!dayRoutine || dayRoutine.slots.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No classes scheduled for this day.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayRoutine.slots.map((slot, idx) => (
              <Card key={idx} className="shadow-sm border rounded-xl p-4">
                <CardContent>
                  <h3 className="font-bold text-slate-800">{slot.courseId}</h3>
                  <p className="text-sm text-gray-600 font-mono mt-1">
                    {slot.startHour}:{slot.startMinute} {slot.startPeriod} -{" "}
                    {slot.endHour}:{slot.endMinute} {slot.endPeriod}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}