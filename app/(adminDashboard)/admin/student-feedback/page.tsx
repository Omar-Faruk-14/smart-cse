"use client";
import Swal from "sweetalert2";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Trash2 } from "lucide-react";

interface Feedback {
  _id: string;
  courseId: string;
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

  /* ================= FETCH FEEDBACK ================= */
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
          console.error("Fetch failed:", res.status);
          setFeedbackList([]);
          return;
        }

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data.data || data.feedback || [];

        setFeedbackList(list);
      } catch (error) {
        console.error("Fetch error:", error);
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [token]);

  
  /* ================= DELETE FEEDBACK ================= */
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFeedbackList((prev) => prev.filter((f) => f._id !== id));

        await Swal.fire({
          title: "Deleted!",
          text: "Feedback has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Delete failed!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };
  /* ================= SEARCH FILTER ================= */
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((f) =>
      f.courseId?.toLowerCase().includes(search.toLowerCase()),
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <h1 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">
        Student Feedback
      </h1>



      {/* TABLE */}
      <Card className="rounded-[2.5rem] overflow-hidden shadow-2xl px-5">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow>
              <TableHead className="text-white uppercase">Course ID</TableHead>
              <TableHead className="text-white uppercase">Rating</TableHead>
              <TableHead className="text-white uppercase">Comment</TableHead>
              <TableHead className="text-white uppercase text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFeedback.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  No feedback found
                </TableCell>
              </TableRow>
            )}

            {filteredFeedback.map((fb) => (
              <TableRow key={fb._id} className="hover:bg-muted/40">
                <TableCell className="font-bold text-primary">
                  {fb.courseId}
                  <p className="text-xs text-muted-foreground">
                    {new Date(fb.createdAt).toDateString()}
                  </p>
                </TableCell>

                <TableCell>
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
                    <span className="ml-2 font-bold text-sm">
                      ({Number(fb.rating)})
                    </span>
                  </div>
                </TableCell>

                <TableCell className="max-w-xs text-sm text-muted-foreground">
                  {fb.comment}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDelete(fb._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
