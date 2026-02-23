"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Star } from "lucide-react";

interface Feedback {
  _id: string;
  courseName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export default function StudentFeedback() {
  const { data: session } = useSession();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    if (!token) return;

    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setFeedbackList([]);
          return;
        }

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data.data || data.feedback || [];

        setFeedbackList(
          list.map((f: any) => ({
            ...f,
            courseName: f.courseName || f.courseId,
          }))
        );
      } catch {
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [token]);

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((f) =>
      f.courseName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [feedbackList, search]);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold uppercase italic text-center mb-4">
        Student Feedback
      </h1>

      {/* SEARCH */}
      <div className="flex justify-center mb-6">
        <Input
          placeholder="Search by course name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full"
        />
      </div>

      {/* TABLE */}
      <Card className="rounded-xl shadow-lg overflow-x-auto">
        <Table className="min-w-full table-auto">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-white uppercase text-left px-4 py-3">
                Course Name
              </TableHead>
              <TableHead className="text-white uppercase text-left px-4 py-3">
                Rating
              </TableHead>
              <TableHead className="text-white uppercase text-left px-4 py-3">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFeedback.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No feedback found
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedback.map((fb, i) => (
                <TableRow
                  key={fb._id}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="px-4 py-3 font-semibold text-gray-900">
                    {fb.courseName}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={
                            index < Number(fb.rating)
                              ? "fill-yellow-500 stroke-yellow-500"
                              : "fill-none stroke-yellow-500"
                          }
                        />
                      ))}
                      <span className="ml-2 font-medium text-sm text-gray-700">
                        ({Number(fb.rating)})
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-600 max-w-xl">
                    {fb.comment}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}