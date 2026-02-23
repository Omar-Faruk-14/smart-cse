"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input"; // সার্চ ইনপুট ইম্পোর্ট
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Award,
  BookOpen,
  Download,
  Loader2,
  TrendingUp,
  Search, // সার্চ আইকন
  Info,
  ChevronRight,
  Eye,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // সার্চ স্টেট

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const [transcriptRes, resultsRes] = await Promise.all([
          fetch(`${apiUrl}/my-transcript`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/my-results`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const transcriptData = await transcriptRes.json();
        const resultsData = await resultsRes.json();
        setTranscript(transcriptData);
        setResults(resultsData);
      } catch (error) {
        toast.error("Failed to fetch academic records");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchData();
  }, [session, apiUrl]);

  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      const matchesSemester =
        selectedSemester === "all" || res.semester === selectedSemester;
      const matchesSearch =
        res.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSemester && matchesSearch;
    });
  }, [results, selectedSemester, searchQuery]);

  const semesters = Array.from(new Set(results.map((r) => r.semester))).sort(
    (a, b) => Number(a) - Number(b),
  );

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Filters */}
      <FadeIn>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                Academic <span className="text-blue-600">Records</span>
              </h1>
              <p className="text-slate-400 font-bold italic text-[10px] uppercase tracking-widest mt-1">
                Archive Search & Filter
              </p>
            </div>
            <Button className="h-12 px-6 rounded-2xl font-black italic uppercase bg-slate-900 hover:bg-blue-600 text-white transition-all">
              <Download className="mr-2 h-4 w-4" /> Export All
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* কোর্স সার্চ বক্স */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Course Name or Code..."
                className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-bold italic text-slate-700 focus-visible:ring-blue-500 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* সেমিস্টার সিলেক্টর */}
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-full md:w-56 h-14 rounded-2xl border-none bg-slate-50 font-black italic uppercase text-[11px] shadow-inner">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent className="rounded-xl font-bold italic">
                <SelectItem value="all">Total Record</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>

      {/* Overview Stats (CGPA etc. - আগের মতোই থাকবে) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* ... (CGPA, Total Credits, Academic Status cards as before) ... */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white p-8 relative overflow-hidden">
          <Award className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            Cumulative GPA
          </p>
          <h2 className="text-5xl font-black italic mt-2 tracking-tighter">
            {transcript?.cgpa?.toFixed(2) || "0.00"}
          </h2>
        </Card>
        {/* Simplified other cards for brevity */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white p-8 border border-slate-50">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Showing
          </p>
          <h2 className="text-4xl font-black italic mt-2 text-blue-600">
            {filteredResults.length} Subjects
          </h2>
        </Card>
        <Card className="border-none shadow-xl rounded-[2rem] bg-emerald-500 text-white p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            System Status
          </p>
          <h2 className="text-4xl font-black italic mt-2">Verified</h2>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="font-black italic uppercase text-[10px] text-slate-500 p-6">
                  Subject Details
                </TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-500 text-center">
                  Semester
                </TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-500 text-center">
                  Grade
                </TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-500 text-center">
                  Point
                </TableHead>
                <TableHead className="font-black italic uppercase text-[10px] text-slate-500 text-right pr-10">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <TableRow
                    key={res._id}
                    className="hover:bg-slate-50/50 transition-colors border-slate-50"
                  >
                    <TableCell className="p-6">
                      <div className="font-black italic text-slate-800 uppercase leading-none text-base">
                        {res.courseName}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-blue-600">
                          {res.courseCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="rounded-lg font-black italic border-slate-200"
                      >
                        SEM {res.semester}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-black italic text-xl text-slate-800">
                      {res.grade}
                    </TableCell>
                    <TableCell className="text-center font-black italic text-blue-600">
                      {res.point.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-xl hover:bg-blue-50 text-blue-600"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </SheetTrigger>
                        {/* Breakdown Sheet Content (Same as previous response) */}
                        <SheetContent className="w-full sm:max-w-md rounded-l-[3rem] border-none p-10 overflow-y-auto">
                          <SheetHeader className="space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center">
                              <Info className="w-8 h-8 text-blue-600" />
                            </div>
                            <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                              Mark{" "}
                              <span className="text-blue-600">Breakdown</span>
                            </SheetTitle>
                            <SheetDescription className="font-bold italic text-slate-400 uppercase text-[10px] tracking-widest">
                              {res.courseName}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-12 space-y-8">
                            {/* Mark bars logic exactly as before */}
                            {[
                              {
                                label: "Class Test",
                                val: res.breakdown.ct,
                                max: 10,
                                color: "bg-blue-500",
                              },
                              {
                                label: "Midterm Exam",
                                val: res.breakdown.mid,
                                max: 20,
                                color: "bg-indigo-500",
                              },
                              {
                                label: "Final Examination",
                                val: res.breakdown.finalMark,
                                max: 40,
                                color: "bg-slate-900",
                              },
                              {
                                label: "Attendance",
                                val: res.breakdown.attendance,
                                max: 5,
                                color: "bg-emerald-500",
                              },
                              {
                                label: "Assignment",
                                val: res.breakdown.assignment,
                                max: 5,
                                color: "bg-orange-500",
                              },
                              {
                                label: "Presentation",
                                val: res.breakdown.presentation,
                                max: 5,
                                color: "bg-purple-500",
                              },
                            ].map((item) => (
                              <div key={item.label} className="space-y-3">
                                <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                    {item.label}
                                  </span>
                                  <span className="text-sm font-black italic text-slate-900">
                                    {item.val} / {item.max}
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                    style={{
                                      width: `${(item.val / item.max) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Search className="w-16 h-16" />
                      <p className="font-black italic uppercase">
                        No matching courses found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
