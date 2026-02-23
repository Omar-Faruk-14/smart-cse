"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Calendar,
} from "lucide-react";

export default function DynamicAttendancePage() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // API URL defined
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      // User ID বা Session না থাকলে ফেচ করবে না
      if (!session?.user || !user?._id) return;

      try {
        const token = (session as any)?.user?.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        // ১. এটেনডেন্স এবং ২. কোর্স ডাটা প্যারালালে ফেচ করা (Performance Optimization)
        const [attRes, courseRes] = await Promise.all([
          fetch(`${apiUrl}/attendance?semester=${user.semester}`, { headers }),
          fetch(`${apiUrl}/courses/${user.semester}`, { headers }),
        ]);

        const attJson = attRes.ok ? await attRes.json() : [];
        const courseJson = courseRes.ok ? await courseRes.json() : [];

        setAttendanceData(attJson);
        setCourses(courseJson);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, user, apiUrl]);

  // --- Logic: Calculation using useMemo (Performance) ---
  const { courseAnalysis, stats } = useMemo(() => {
    if (!user?._id)
      return {
        courseAnalysis: [],
        stats: { avg: 0, present: 0, absent: 0, risk: 0 },
      };

    const studentId = user._id.toString();
    let totalPresentCount = 0;
    let totalAbsentCount = 0;

    const analysis = courses.map((course) => {
      const relevantRecords = attendanceData.filter(
        (r) => r.course === course.name || r.courseCode === course.courseCode,
      );

      const attended = relevantRecords.filter(
        (r) =>
          r.attendance[studentId] === "P" || r.attendance[studentId] === "L",
      ).length;

      const total = relevantRecords.length;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

      totalPresentCount += attended;
      totalAbsentCount += total - attended;

      return {
        ...course,
        present: attended,
        absent: total - attended,
        total,
        percentage,
      };
    });

    const avg =
      analysis.length > 0
        ? Math.round(
            analysis.reduce((sum, c) => sum + c.percentage, 0) /
              analysis.length,
          )
        : 0;

    const risk = analysis.filter(
      (c) => c.total > 0 && c.percentage < 75,
    ).length;

    return {
      courseAnalysis: analysis,
      stats: {
        avg,
        present: totalPresentCount,
        absent: totalAbsentCount,
        risk,
      },
    };
  }, [attendanceData, courses, user?._id]);

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          ATTENDANCE{" "}
          <span className="text-blue-600 tracking-normal">REPORT</span>
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Overall Rate"
          value={`${stats.avg}%`}
          icon={ClipboardCheck}
          progress={stats.avg}
          color="text-blue-600"
        />
        <StatCard
          title="Total Present"
          value={stats.present}
          icon={CheckCircle2}
          subText="Total attended classes"
          color="text-emerald-500"
        />
        <StatCard
          title="Total Absent"
          value={stats.absent}
          icon={XCircle}
          subText="Classes missed"
          color="text-rose-500"
        />
        <StatCard
          title="At Risk"
          value={stats.risk}
          icon={AlertTriangle}
          subText="Below 75% threshold"
          color="text-amber-500"
        />
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="courses"
            className="rounded-lg font-bold italic uppercase px-6 data-[state=active]:bg-white shadow-sm"
          >
            Course Wise
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg font-bold italic uppercase px-6 data-[state=active]:bg-white shadow-sm"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-white">
            <CardHeader>
              <CardTitle className="italic font-black uppercase text-xl">
                Academic Breakdown
              </CardTitle>
              <CardDescription className="italic font-medium">
                Semester {user?.semester} Attendance Analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {courseAnalysis.length > 0 ? (
                courseAnalysis.map((course, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="font-black italic uppercase text-sm tracking-tight">
                          {course.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {course.courseCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-black italic ${course.percentage < 75 ? "text-rose-500" : "text-slate-900"}`}
                        >
                          {course.percentage}%
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">
                          {course.present}/{course.total} Lectures
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={course.percentage}
                      className={`h-2 ${course.percentage < 75 ? "[&>div]:bg-rose-500" : "[&>div]:bg-slate-900"}`}
                    />
                    <div className="flex gap-4">
                      <Badge
                        variant="outline"
                        className="rounded-lg font-black text-[9px] border-emerald-200 text-emerald-600 bg-emerald-50"
                      >
                        PRESENT: {course.present}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-lg font-black text-[9px] border-rose-200 text-rose-600 bg-rose-50"
                      >
                        ABSENT: {course.absent}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 font-bold italic text-slate-400 uppercase">
                  No Courses Found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white italic uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="p-5 font-black">Date</th>
                      <th className="p-5 font-black">Course</th>
                      <th className="p-5 font-black">Instructor</th>
                      <th className="p-5 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceData.length > 0 ? (
                      attendanceData.map((record, idx) => {
                        const status =
                          record.attendance[user?._id?.toString() || ""];
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-5 text-xs font-bold italic">
                              {record.date}
                            </td>
                            <td className="p-5 text-xs font-black uppercase italic">
                              {record.course}
                            </td>
                            <td className="p-5 text-xs font-medium text-slate-500 italic uppercase">
                              {record.teacher}
                            </td>
                            <td className="p-5">
                              <Badge
                                className={`rounded-lg italic uppercase text-[9px] font-black ${
                                  status === "P"
                                    ? "bg-emerald-500"
                                    : status === "L"
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                }`}
                              >
                                {status === "P"
                                  ? "Present"
                                  : status === "L"
                                    ? "Late"
                                    : "Absent"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-10 text-center font-bold italic text-slate-400 uppercase"
                        >
                          No History Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, progress, subText, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">
              {title}
            </p>
            <p className="text-3xl font-black italic tracking-tighter">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>
            <Icon size={20} />
          </div>
        </div>
        {progress !== undefined ? (
          <Progress value={progress} className="h-1.5 mt-4" />
        ) : (
          <p className="text-[9px] font-bold text-slate-400 mt-4 italic uppercase">
            {subText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
