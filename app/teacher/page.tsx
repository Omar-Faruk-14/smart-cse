"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Course {
  _id: string;
  name: string;
  code: string;
  teacherId: string;
  semester: string;
  credit: number;
  imageUrl?: string;
  resources?: any[];
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  teacherId: string;
}

type SemesterCourses = Record<string, Course[]>;

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [groupedCourses, setGroupedCourses] = useState<SemesterCourses>({});
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;
  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    if (status !== "authenticated" || !email || !token) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const teacherRes = await fetch(`${API_URL}/users/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teacher: Teacher = await teacherRes.json();

        const courseRes = await fetch(`${API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courses: Course[] = await courseRes.json();

        const myCourses = courses.filter(
          (c) => c.teacherId === teacher.teacherId
        );

        const grouped = myCourses.reduce<SemesterCourses>((acc, course) => {
          acc[course.semester] = acc[course.semester] || [];
          acc[course.semester].push(course);
          return acc;
        }, {});

        setGroupedCourses(grouped);
      } catch (e) {
        console.error("Failed to load dashboard", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [status, email, token, API_URL]);

  const totalCourses = useMemo(
    () => Object.values(groupedCourses).flat().length,
    [groupedCourses]
  );

  if (loading || status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* ===== TOP SECTION (MATCHED) ===== */}
      <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-black">
          Welcome, <span className="text-blue-400">{session?.user?.name || "Teacher"}</span>
        </h1>
        <p className="mt-3 font-medium text-slate-400">
          You are teaching <span className="font-bold text-white">{totalCourses}</span> course(s).
        </p>
      </section>

      {/* ===== SEMESTER-WISE TABLES (MATCHED STYLE) ===== */}
      {Object.keys(groupedCourses).length === 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="py-10 text-center">No courses found</CardContent>
        </Card>
      )}

      {Object.entries(groupedCourses).map(([semester, courses]) => (
        <Card key={semester} className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Semester {semester}</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Resources</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.name}
                          className="h-12 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-20 rounded-lg bg-slate-200" />
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{course.name}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.credit}</TableCell>
                    <TableCell>{course.resources?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
