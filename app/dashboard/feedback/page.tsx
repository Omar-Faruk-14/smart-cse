"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MessageSquare,
  Send,
  Loader2,
  History,
  CheckCircle2,
} from "lucide-react";

export default function StudentFeedbackPage() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [courses, setCourses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState({ name: "", code: "" });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user || !user?.semester) return;
      try {
        const token = (session as any)?.user?.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        const [courseRes, historyRes] = await Promise.all([
          fetch(`${apiUrl}/courses/${user.semester}`, { headers }),
          fetch(`${apiUrl}/feedback`, { headers }),
        ]);

        const courseData = await courseRes.json();
        const historyData = await historyRes.json();

        setCourses(Array.isArray(courseData) ? courseData : []);
        setHistory(
          Array.isArray(historyData)
            ? historyData.filter(
                (f: any) => f.studentEmail === session.user?.email,
              )
            : [],
        );
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, user, apiUrl]);

  const handleSubmit = async () => {
    if (user?.role !== "student") {
      toast.error("Only students can submit feedback.");
      return;
    }

    if (!selectedCourse.name || rating === 0 || !comment) {
      toast.error("Please fill all fields!");
      return;
    }

    setSubmitting(true);
    try {
      const token = (session as any)?.user?.accessToken;
      await axios.post(
        `${apiUrl}/feedback`,
        {
          courseName: selectedCourse.name,
          courseId: selectedCourse.code, // ব্যাকএন্ডে courseId হিসেবে পাঠাচ্ছি
          rating: rating,
          comment: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Feedback submitted successfully!");
      setRating(0);
      setComment("");
      setSelectedCourse({ name: "", code: "" });

      const historyRes = await fetch(`${apiUrl}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const historyData = await historyRes.json();
      setHistory(
        historyData.filter((f: any) => f.studentEmail === session?.user?.email),
      );
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Course <span className="text-blue-600">Feedback</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            ID: {session?.user?.email?.split("@")[0]}
          </p>
        </div>
        <Badge className="bg-blue-600 px-4 py-1.5 rounded-full font-black italic uppercase text-xs">
          {user?.semester} Semester
        </Badge>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8 w-fit">
          <TabsTrigger
            value="add"
            className="rounded-xl font-black italic uppercase px-8 text-xs"
          >
            Post Feedback
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl font-black italic uppercase px-8 text-xs"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 border-none shadow-2xl rounded-[2.5rem] bg-white">
            <CardHeader className="p-8 pb-4 text-center md:text-left">
              <CardTitle className="italic font-black uppercase text-xl">
                Share Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-3">
                <Label className="font-black italic uppercase text-[10px] text-slate-400 ml-1">
                  Subject
                </Label>
                <Select
                  value={selectedCourse.name}
                  onValueChange={(val) => {
                    const selected = courses.find((c) => c.name === val);
                    setSelectedCourse({
                      name: selected?.name || "",
                      code: selected?.courseCode || selected?.code || "",
                    });
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-2 h-14 font-bold italic">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {courses.map((c) => (
                      <SelectItem
                        key={c._id}
                        value={c.name}
                        className="font-bold italic uppercase py-3"
                      >
                        {c.name} ({c.courseCode || c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="font-black italic uppercase text-[10px] text-slate-400 block ml-1">
                  Rating
                </Label>
                <div className="flex flex-row items-center gap-6 bg-slate-50 p-6 rounded-[2rem] border-2">
                  <div style={{ display: "inline-block", direction: "ltr" }}>
                    <Rating
                      onClick={(rate) => setRating(rate)}
                      initialValue={rating}
                      size={38}
                      transition
                      fillColor="#f1c40f"
                      emptyColor="#e2e8f0"
                      SVGstyle={{ display: "inline" }}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center bg-white h-14 w-14 rounded-2xl shadow-sm border-2">
                    <span className="text-2xl font-black italic text-blue-600 leading-none">
                      {rating}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 mt-1">
                      / 5
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-black italic uppercase text-[10px] text-slate-400 ml-1">
                  Comment
                </Label>
                <Textarea
                  placeholder="Tell us about the instructor and the course material..."
                  className="rounded-[1.5rem] border-2 min-h-[150px] font-medium italic p-5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black italic uppercase tracking-widest shadow-xl transition-all hover:bg-blue-600"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black italic uppercase text-slate-400 text-[11px] tracking-widest px-2">
              Waiting for Review
            </h3>
            {courses
              .filter((c) => !history.some((h) => h.courseName === c.name))
              .map((course) => (
                <div
                  key={course._id}
                  onClick={() =>
                    setSelectedCourse({
                      name: course.name,
                      code: course.courseCode || course.code,
                    })
                  }
                  className={`bg-white p-5 rounded-[1.5rem] border flex justify-between items-center group cursor-pointer transition-all ${selectedCourse.name === course.name ? "border-blue-600 bg-blue-50" : "hover:border-blue-500"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black italic text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {(course.courseCode || course.code)?.substring(0, 2) ||
                        "C"}
                    </div>
                    <div>
                      <p className="font-black italic uppercase text-sm text-slate-800">
                        {course.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {course.courseCode || course.code}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2
                    className={`${selectedCourse.name === course.name ? "text-blue-600" : "text-slate-100"} group-hover:text-blue-500 w-5 h-5`}
                  />
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white italic uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="p-8">Course Info</th>
                    <th className="p-8">Rating</th>
                    <th className="p-8">Comment</th>
                    <th className="p-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium italic text-slate-700">
                  {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-8">
                        <p className="font-black uppercase text-xs text-slate-800">
                          {item.courseName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.courseId}
                        </p>
                      </td>
                      <td className="p-8">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-8 text-xs max-w-xs truncate">
                        "{item.comment}"
                      </td>
                      <td className="p-8">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black italic uppercase text-[9px]">
                          Verified
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
