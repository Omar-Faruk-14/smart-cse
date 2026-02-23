"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

/* ================= TYPES ================= */
interface Student {
  name: string;
  studentId: string;
  batch: string;
  cgpa: number;
  attendancePercent: number;
}

/* ================= COMPONENT ================= */
export default function StudentOverviewPage() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [students, setStudents] = useState<Student[]>([]);
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      const params = new URLSearchParams();
      if (batch) params.append("batch", batch);
      if (semester) params.append("semester", semester);

      const res = await fetch(
        `${API_URL}/student-overview?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [batch, semester, session]);

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
          Student Overview
        </h1>
        <p className="text-sm text-slate-500 font-semibold">
          CGPA & Attendance Summary
        </p>
      </div>

      {/* FILTERS */}
      <Card className="p-6 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Filter by Batch"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="font-semibold"
        />

        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="font-semibold">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <SelectItem key={s} value={String(s)}>
                Semester {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : (
            <Table className="[&_tr:hover]:bg-transparent">
              <TableHeader className="bg-slate-900">
                <TableRow>
                  <TableHead className="text-white font-bold py-6 px-8 uppercase italic">
                    Student
                  </TableHead>
                  <TableHead className="text-white font-bold py-6 uppercase italic">
                    Batch
                  </TableHead>
                  <TableHead className="text-white font-bold py-6 uppercase italic text-center">
                    CGPA
                  </TableHead>
                  <TableHead className="text-white font-bold py-6 uppercase italic text-center px-8">
                    Attendance %
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-slate-500"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow
                      key={s.studentId}
                      className="transition hover:bg-slate-50"
                    >
                      <TableCell className="px-8 py-6">
                        <p className="font-bold text-slate-800">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {s.studentId}
                        </p>
                      </TableCell>

                      <TableCell className="font-semibold">
                        {s.batch}
                      </TableCell>

                      <TableCell className="text-center font-black">
                        <span
                          className={
                            s.cgpa >= 3.5
                              ? "text-green-600"
                              : s.cgpa >= 3
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {s.cgpa}
                        </span>
                      </TableCell>

                      <TableCell className="text-center font-black px-8">
                        <span
                          className={
                            s.attendancePercent >= 75
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {s.attendancePercent}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {students.map((s) => (
          <Card
            key={s.studentId}
            className="p-6 rounded-3xl shadow-lg space-y-2"
          >
            <p className="font-black uppercase">{s.name}</p>
            <p className="text-xs text-slate-500">{s.studentId}</p>

            <div className="flex justify-between pt-4">
              <span className="font-bold text-sm">
                CGPA:{" "}
                <span className="font-black">{s.cgpa}</span>
              </span>
              <span className="font-bold text-sm">
                Attendance:{" "}
                <span className="font-black">
                  {s.attendancePercent}%
                </span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}