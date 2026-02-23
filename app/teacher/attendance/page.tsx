"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Loader2,
  Download,
  Save,
  Calendar,
  FileText,
  CheckCircle2,
  Search,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Status = "P" | "A" | "L";

export default function AttendanceSheetPage() {
  const { data: session, status } = useSession();

  // ফিল্টার স্টেটস
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [course, setCourse] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // ডাটা স্টেটস
  const [courseList, setCourseList] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // লোডিং ও ভিউ স্টেটস
  const [isMonthlyView, setIsMonthlyView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // তারিখ ফরম্যাট: YYYY-MM-DD
  const todayDate = new Date().toISOString().split("T")[0];
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  // ১. সকল স্টুডেন্ট ফেচ করা
  useEffect(() => {
    if (status === "authenticated") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${apiUrl}/users`, {
            headers: {
              Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
            },
          });
          setAllStudents(
            res.data.filter((user: any) => user.role === "student"),
          );
        } catch (error) {
          toast.error("Failed to fetch student database");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [status, apiUrl, session]);

  // ২. সেমিস্টার অনুযায়ী কোর্স ফেচ করা
  useEffect(() => {
    const fetchCourses = async () => {
      if (!semester) {
        setCourseList([]);
        setCourse("");
        return;
      }
      setCourseLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/courses/${semester}`, {
          headers: {
            Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
          },
        });
        setCourseList(res.data || []);
      } catch (error) {
        toast.error("Error loading courses");
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourses();
  }, [semester, apiUrl, session]);

  // ৩. ডেইলি শীট লোড করা (Modify or Create New)
  const loadDailySheet = async () => {
    if (!semester || !batch || !course) {
      toast.error("Please select Semester, Batch, and Course");
      return;
    }

    setIsMonthlyView(false);
    const filtered = allStudents
      .filter((s) => s.semester === semester && s.batch === batch)
      .sort((a, b) => a.studentId.localeCompare(b.studentId));

    if (filtered.length === 0) {
      toast.error("No students found for this batch/semester");
      setStudents([]);
      return;
    }
    setStudents(filtered);

    try {
      // ব্যাকএন্ডে চেক করা হচ্ছে আজকের রেকর্ড আছে কি না
      const res = await axios.get(
        `${apiUrl}/attendance/check?semester=${semester}&batch=${batch}&course=${course}&date=${todayDate}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
          },
        },
      );

      if (res.data && res.data.attendance) {
        setAttendance(res.data.attendance);
        toast.success("Previous record found! You can now modify it.");
      } else {
        // নতুন রেকর্ড হলে সবাইকে প্রেজেন্ট (P) হিসেবে ডিফল্ট সেট করা
        const initial: Record<string, Status> = {};
        filtered.forEach((s) => {
          initial[s._id] = "P";
        });
        setAttendance(initial);
        toast("New sheet generated for today", { icon: "📝" });
      }
    } catch (error) {
      const initial: Record<string, Status> = {};
      filtered.forEach((s) => {
        initial[s._id] = "P";
      });
      setAttendance(initial);
    }
  };

  // ৪. অ্যাটেনডেন্স সেভ/আপডেট (Upsert)
  const saveAttendance = async () => {
    if (!course || students.length === 0)
      return toast.error("Please load students first");

    setIsSaving(true);
    try {
      const payload = {
        semester,
        batch,
        course,
        date: todayDate,
        teacher: session?.user?.name,
        attendance,
      };

      await axios.post(`${apiUrl}/attendance/upsert`, payload, {
        headers: {
          Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
        },
      });

      toast.success(`Records successfully updated for ${course}`);
    } catch (error) {
      toast.error("Failed to sync with server");
    } finally {
      setIsSaving(false);
    }
  };

  // ৫. মান্থলি ভিউ লোড করা
  const fetchMonthlyAttendance = async () => {
    if (!semester || !batch || !selectedMonth || !course) {
      return toast.error("Select Semester, Batch, Course, and Month");
    }
    try {
      const res = await axios.get(
        `${apiUrl}/attendance/monthly?semester=${semester}&batch=${batch}&month=${selectedMonth}&course=${course}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.user?.accessToken}`,
          },
        },
      );

      if (res.data.length === 0) {
        toast.error("No records found for this month");
        return;
      }

      const sortedData = res.data.sort((a: any, b: any) =>
        a.date.localeCompare(b.date),
      );
      setMonthlyData(sortedData);
      setIsMonthlyView(true);

      const idsInMonth = Array.from(
        new Set(sortedData.flatMap((d: any) => Object.keys(d.attendance))),
      );
      setStudents(allStudents.filter((s) => idsInMonth.includes(s._id)));
    } catch (error) {
      toast.error("Error loading monthly report");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={50} />
        <p className="font-black italic uppercase text-slate-400">
          Loading Database...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
            Attendance <span className="text-blue-600">Sync</span>
          </h1>
          <p className="text-slate-400 font-bold italic text-[10px] uppercase tracking-widest mt-1">
            Real-time Upsert System Enabled
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="outline"
            className="border-2 border-slate-900 font-black italic uppercase px-6 py-2 rounded-2xl"
          >
            <UserCheck className="w-4 h-4 mr-2" /> {session?.user?.name}
          </Badge>
          <Badge className="bg-blue-600 font-black italic uppercase px-6 py-2 rounded-2xl">
            {todayDate}
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-slate-50 rounded-xl p-4 font-black italic text-xs uppercase outline-none focus:ring-2 ring-blue-500"
        >
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i + 1}>
              SEM {i + 1}
            </option>
          ))}
        </select>

        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="bg-slate-50 rounded-xl p-4 font-black italic text-xs uppercase outline-none focus:ring-2 ring-blue-500"
        >
          <option value="">Batch</option>
          {[...Array(15)].map((_, i) => (
            <option key={i} value={i + 10}>
              Batch {i + 10}
            </option>
          ))}
        </select>

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          disabled={courseLoading}
          className="bg-slate-50 rounded-xl p-4 font-black italic text-xs uppercase md:col-span-2 outline-none focus:ring-2 ring-blue-500 disabled:opacity-50"
        >
          <option value="">
            {courseLoading ? "Loading Courses..." : "Select Course"}
          </option>
          {courseList.map((c) => (
            <option key={c._id} value={c.courseName || c.name}>
              {c.courseCode || c.code} - {c.courseName || c.name}
            </option>
          ))}
        </select>

        <button
          onClick={loadDailySheet}
          className="bg-slate-900 text-white font-black italic uppercase text-[10px] rounded-2xl p-4 hover:bg-blue-600 flex items-center justify-center gap-2 transition-all"
        >
          <Calendar size={16} /> Load Daily
        </button>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-50 rounded-xl p-4 font-black italic text-xs uppercase outline-none"
        >
          <option value="">Month</option>
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={fetchMonthlyAttendance}
          className="bg-blue-600 text-white font-black italic uppercase text-[10px] rounded-2xl p-4 hover:bg-slate-900 flex items-center justify-center gap-2"
        >
          <FileText size={16} /> Monthly
        </button>
      </div>

      {/* Main Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 italic uppercase text-[9px] tracking-widest">
                  <th className="p-8">ID / Roll</th>
                  <th className="p-8">Student Name</th>
                  {isMonthlyView ? (
                    monthlyData.map((d) => (
                      <th
                        key={d.date}
                        className="p-4 text-center text-white border-l border-slate-800"
                      >
                        {d.date.split("-")[2]}
                      </th>
                    ))
                  ) : (
                    <th className="p-8 text-center text-white border-l border-slate-800">
                      Attendance Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-8 font-black italic text-blue-600 text-sm">
                      {s.studentId}
                    </td>
                    <td className="p-8 font-black uppercase italic text-slate-800 text-sm">
                      {s.name}
                    </td>
                    {isMonthlyView ? (
                      monthlyData.map((d) => {
                        const status = d.attendance?.[s._id];
                        return (
                          <td
                            key={d.date}
                            className={`p-4 text-center font-black italic text-xs border-l ${
                              status === "P"
                                ? "text-emerald-500"
                                : status === "A"
                                  ? "text-rose-500"
                                  : "text-amber-500"
                            }`}
                          >
                            {status || "—"}
                          </td>
                        );
                      })
                    ) : (
                      <td className="p-8 text-center bg-slate-50/30 border-l">
                        <select
                          value={attendance[s._id]}
                          onChange={(e) =>
                            setAttendance({
                              ...attendance,
                              [s._id]: e.target.value as Status,
                            })
                          }
                          className={`font-black italic text-xs px-6 py-3 rounded-xl border-2 uppercase outline-none transition-all cursor-pointer ${
                            attendance[s._id] === "P"
                              ? "border-emerald-200 text-emerald-600 bg-white"
                              : attendance[s._id] === "A"
                                ? "border-rose-200 text-rose-600 bg-white"
                                : "border-amber-200 text-amber-600 bg-white"
                          }`}
                        >
                          <option value="P">Present</option>
                          <option value="A">Absent</option>
                          <option value="L">Leave</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-10 bg-slate-50/80 flex flex-wrap gap-4 justify-between items-center border-t">
            {!isMonthlyView && (
              <button
                onClick={saveAttendance}
                disabled={isSaving}
                className="bg-emerald-500 text-white font-black italic uppercase px-12 py-5 rounded-[1.5rem] hover:bg-emerald-600 shadow-xl flex items-center gap-3 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Commit Changes
              </button>
            )}
            <button className="bg-slate-900 text-white font-black italic uppercase px-12 py-5 rounded-[1.5rem] hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl">
              <Download size={20} /> PDF Report
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {students.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <Search className="w-16 h-16 text-slate-100 mb-4" />
          <p className="font-black italic uppercase text-slate-300 tracking-widest">
            Select Parameters to Generate Sheet
          </p>
        </div>
      )}
    </div>
  );
}
