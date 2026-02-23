"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */
interface Course {
  _id: string;
  code: string;
}

interface TimeSlot {
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
  slots: TimeSlot[];
}

interface Routine {
  _id: string;
  semester: string;
  routines: DayRoutine[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

/* ================= COMPONENT ================= */
export default function RoutineManagement() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  /* ========== STATE ========== */
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [dayRoutines, setDayRoutines] = useState<DayRoutine[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  const [filterSemester, setFilterSemester] = useState("all");

  /* modal state */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    routineId: string;
    dayIndex: number;
    slotIndex: number;
    slot: TimeSlot;
  } | null>(null);

  /* ================= FETCH ROUTINES ================= */
  const fetchRoutines = async () => {
    const token = (session?.user as any)?.accessToken;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/routines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoutines(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [session]);

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async (sem: string) => {
    if (!sem) return;
    const token = (session?.user as any)?.accessToken;
    try {
      const res = await fetch(`${API_URL}/courses?semester=${sem}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD DAY ================= */
  const addDay = (day: string) => {
    if (dayRoutines.find((d) => d.day === day)) return;
    setDayRoutines([...dayRoutines, { day, slots: [] }]);
  };

  /* ================= ADD SLOT ================= */
  const addSlot = (dayIndex: number) => {
    const updated = [...dayRoutines];
    updated[dayIndex].slots.push({
      startHour: "",
      startMinute: "",
      startPeriod: "AM",
      endHour: "",
      endMinute: "",
      endPeriod: "AM",
      courseId: "",
    });
    setDayRoutines(updated);
  };

  /* ================= SAVE ROUTINE ================= */
  const saveRoutine = async () => {
    if (!semester || dayRoutines.length === 0) {
      toast.error("Please complete all fields");
      return;
    }

    const token = (session?.user as any)?.accessToken;

    try {
      const res = await fetch(
        editingRoutineId
          ? `${API_URL}/routines/${editingRoutineId}`
          : `${API_URL}/routines`,
        {
          method: editingRoutineId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ semester, routines: dayRoutines }),
        }
      );

      if (res.ok) {
        toast.success("Routine saved");
        setSemester("");
        setDayRoutines([]);
        setEditingRoutineId(null);
        fetchRoutines();
      } else {
        toast.error("Failed to save routine");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving routine");
    }
  };

  /* ================= DELETE SLOT ================= */
  const deleteSlot = async (routineId: string, dayIndex: number, slotIndex: number) => {
    const confirm = await Swal.fire({
      title: "Delete slot?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
    });
    if (!confirm.isConfirmed) return;

    const routine = routines.find((r) => r._id === routineId);
    if (!routine) return;

    routine.routines[dayIndex].slots.splice(slotIndex, 1);

    const token = (session?.user as any)?.accessToken;
    await fetch(`${API_URL}/routines/${routineId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        semester: routine.semester,
        routines: routine.routines,
      }),
    });

    toast.success("Slot deleted");
    fetchRoutines();
  };

  /* ================= OPEN EDIT MODAL ================= */
  const openEditModal = (
    routineId: string,
    dayIndex: number,
    slotIndex: number,
    slot: TimeSlot
  ) => {
    setEditData({ routineId, dayIndex, slotIndex, slot: { ...slot } });
    setEditModalOpen(true);
  };

  /* ================= UPDATE SLOT ================= */
  const updateSlot = async () => {
    if (!editData) return;
    const routine = routines.find((r) => r._id === editData.routineId);
    if (!routine) return;

    routine.routines[editData.dayIndex].slots[editData.slotIndex] = editData.slot;

    const token = (session?.user as any)?.accessToken;
    await fetch(`${API_URL}/routines/${editData.routineId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        semester: routine.semester,
        routines: routine.routines,
      }),
    });

    toast.success("Slot updated");
    setEditModalOpen(false);
    fetchRoutines();
  };

  /* ================= TABLE DATA ================= */
  const tableRows = useMemo(() => {
    return routines
      .filter((r) => filterSemester === "all" || r.semester === filterSemester)
      .flatMap((r) =>
        r.routines.flatMap((d, di) =>
          d.slots.map((s, si) => ({
            routineId: r._id,
            dayIndex: di,
            slotIndex: si,
            day: d.day,
            start: `${s.startHour}:${s.startMinute} ${s.startPeriod}`,
            end: `${s.endHour}:${s.endMinute} ${s.endPeriod}`,
            course: courses.find((c) => c._id === s.courseId)?.code || s.courseId,
          }))
        )
      );
  }, [routines, filterSemester, courses]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-black uppercase italic">Routine Management</h1>

      {/* ================= ADD ROUTINE ================= */}
      <Card className="p-6 space-y-4">
        <Select
          value={semester}
          onValueChange={(val) => {
            setSemester(val);
            fetchCourses(val);
            setDayRoutines([]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {["1","2","3","4","5","6","7","8"].map((s) => (
              <SelectItem key={s} value={s}>
                Semester {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <Button key={day} size="sm" onClick={() => addDay(day)}>
              + {day}
            </Button>
          ))}
        </div>

        {dayRoutines.map((day, dIndex) => (
          <Card key={day.day} className="p-4 space-y-3">
            <h3 className="font-black text-lg">{day.day}</h3>

            {day.slots.map((slot, sIndex) => (
              <div key={sIndex} className="grid md:grid-cols-3 gap-4">
                {/* Start */}
                <div className="flex gap-2">
                  <Input
                    placeholder="HH"
                    value={slot.startHour}
                    onChange={(e) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].startHour = e.target.value;
                      setDayRoutines(u);
                    }}
                    className="w-16 text-center"
                  />
                  <Input
                    placeholder="MM"
                    value={slot.startMinute}
                    onChange={(e) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].startMinute = e.target.value;
                      setDayRoutines(u);
                    }}
                    className="w-16 text-center"
                  />
                  <Select
                    value={slot.startPeriod}
                    onValueChange={(val) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].startPeriod = val as any;
                      setDayRoutines(u);
                    }}
                  >
                    <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* End */}
                <div className="flex gap-2">
                  <Input
                    placeholder="HH"
                    value={slot.endHour}
                    onChange={(e) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].endHour = e.target.value;
                      setDayRoutines(u);
                    }}
                    className="w-16 text-center"
                  />
                  <Input
                    placeholder="MM"
                    value={slot.endMinute}
                    onChange={(e) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].endMinute = e.target.value;
                      setDayRoutines(u);
                    }}
                    className="w-16 text-center"
                  />
                  <Select
                    value={slot.endPeriod}
                    onValueChange={(val) => {
                      const u = [...dayRoutines];
                      u[dIndex].slots[sIndex].endPeriod = val as any;
                      setDayRoutines(u);
                    }}
                  >
                    <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Course */}
                <Select
                  value={slot.courseId}
                  onValueChange={(val) => {
                    const u = [...dayRoutines];
                    u[dIndex].slots[sIndex].courseId = val;
                    setDayRoutines(u);
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c._id} value={c.code}>{c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button size="sm" onClick={() => addSlot(dIndex)}>+ Add Time Slot</Button>
          </Card>
        ))}

        <Button onClick={saveRoutine} className="w-full h-12 font-black text-lg">
          Save Routine
        </Button>
      </Card>

      {/* ================= VIEW ROUTINE TABLE ================= */}
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-black text-xl">All Routines</h2>
          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {["1","2","3","4","5","6","7","8"].map((s) => (
                <SelectItem key={s} value={s}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">Day</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="border p-2">{row.day}</td>
                <td className="border p-2">{row.start}</td>
                <td className="border p-2">{row.end}</td>
                <td className="border p-2 font-semibold text-blue-600">{row.course}</td>
                <td className="border p-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      openEditModal(
                        row.routineId,
                        row.dayIndex,
                        row.slotIndex,
                        routines.find((r) => r._id === row.routineId)!.routines[row.dayIndex].slots[row.slotIndex]
                      )
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSlot(row.routineId, row.dayIndex, row.slotIndex)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Slot</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="HH"
                  value={editData.slot.startHour}
                  onChange={(e) =>
                    setEditData({ ...editData, slot: { ...editData.slot, startHour: e.target.value } })
                  }
                  className="w-16 text-center"
                />
                <Input
                  placeholder="MM"
                  value={editData.slot.startMinute}
                  onChange={(e) =>
                    setEditData({ ...editData, slot: { ...editData.slot, startMinute: e.target.value } })
                  }
                  className="w-16 text-center"
                />
                <Select
                  value={editData.slot.startPeriod}
                  onValueChange={(val) =>
                    setEditData({ ...editData, slot: { ...editData.slot, startPeriod: val as "AM" | "PM" } })
                  }
                >
                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="HH"
                  value={editData.slot.endHour}
                  onChange={(e) =>
                    setEditData({ ...editData, slot: { ...editData.slot, endHour: e.target.value } })
                  }
                  className="w-16 text-center"
                />
                <Input
                  placeholder="MM"
                  value={editData.slot.endMinute}
                  onChange={(e) =>
                    setEditData({ ...editData, slot: { ...editData.slot, endMinute: e.target.value } })
                  }
                  className="w-16 text-center"
                />
                <Select
                  value={editData.slot.endPeriod}
                  onValueChange={(val) =>
                    setEditData({ ...editData, slot: { ...editData.slot, endPeriod: val as "AM" | "PM" } })
                  }
                >
                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select
                value={editData.slot.courseId}
                onValueChange={(val) => setEditData({ ...editData, slot: { ...editData.slot, courseId: val } })}
              >
                <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c.code}>{c.code}</SelectItem>
                    
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={updateSlot} className="w-full">Update Slot</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
