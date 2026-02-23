"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  GraduationCap,
  Eye,
  Download,
  BookOpen,
  FileImage,
  Calendar,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface ExtendedSession {
  user: {
    accessToken?: string;
  };
}

export default function StudentCourses() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.semester) return;
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5001/courses/${user.semester}`,
          {
            headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          },
        );
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Course load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.semester, session]);

  console.log(courses);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground italic uppercase tracking-widest">
          Fetching your curriculum...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
            My Courses
          </h1>
          <p className="text-slate-500 font-medium italic pt-2">
            Semester {user?.semester} • {user?.dept || "Academic"} Department
          </p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-slate-900 text-white px-4 py-2 rounded-xl italic font-bold">
            Total: {courses.length} Subjects
          </Badge>
        </div>
      </div>

      {/* Tabular Form of Courses */}
      <Card className="rounded-[2rem] border shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[120px] font-black uppercase text-[10px] tracking-widest px-8">
                  Code
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">
                  Course Title
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest hidden md:table-cell">
                  Instructor
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">
                  Resources
                </TableHead>
                <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course._id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="px-8 font-bold text-primary italic">
                    {course.code}
                  </TableCell>
                  <TableCell>
                    <p className="font-black text-slate-800 uppercase tracking-tight">
                      {course.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold md:hidden">
                      Instructor: {course.teacherName}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-bold text-slate-600 italic">
                    {course.teacherName || "Not Assigned"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 rounded-lg font-black"
                    >
                      {course.resources?.length || 0} FILES
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      variant="outline"
                      className="rounded-xl font-black italic border-2 hover:bg-slate-900 hover:text-white transition-all uppercase text-xs"
                    >
                      View Materials
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="font-black text-slate-400 uppercase italic">
            No courses found for this semester
          </p>
        </div>
      )}

      {/* Resource Slide-over Sheet */}
      <Sheet
        open={!!selectedCourse}
        onOpenChange={() => setSelectedCourse(null)}
      >
        <SheetContent className="sm:max-w-lg w-full p-0 border-l-0 shadow-2xl overflow-y-auto">
          <div className="bg-slate-900 p-8 text-white">
            <div className="p-3 w-fit rounded-2xl bg-white/10 text-primary mb-4">
              <GraduationCap size={28} />
            </div>
            <SheetHeader>
              <SheetTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {selectedCourse?.name}
              </SheetTitle>
              <SheetDescription className="text-slate-400 font-bold italic">
                {selectedCourse?.code} • Downloadable Study Materials
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="p-6 space-y-4">
            {selectedCourse?.resources?.length > 0 ? (
              selectedCourse.resources.map((res: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border group hover:border-primary transition-all"
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FileImage size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate uppercase italic">
                      {res.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Image Resource
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-blue-100 text-blue-600"
                      onClick={() => setPreviewImage(res.url)}
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-green-100 text-green-600"
                      asChild
                    >
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                      >
                        <Download size={18} />
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 font-bold italic italic">
                  No resources uploaded yet.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-none">
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white font-black italic uppercase tracking-widest bg-black/50 px-4 py-1 rounded-lg">
              Resource Preview
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Resource"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-white/10"
              />
            )}
          </div>
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setPreviewImage(null)}
              className="rounded-xl font-black italic"
            >
              CLOSE PREVIEW
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
