"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  Check,
  X,
  GraduationCap,
  ArrowUpRight,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  imageUrl: string;
  imagePublicId: string;
  postedBy: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [isMounted, setIsMounted] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    pendingUsersCount: 0,
    totalNotices: 0,
  });

  //  ADMIN STATS API CALL
  const fetchAdminStats = async () => {
    try {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      const res = await fetch(`${API_URL}/admin-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Admin stats error");
        return;
      }

      setStats({
        totalStudents: data.totalStudents,
        totalTeachers: data.totalTeachers,
        pendingUsersCount: data.pendingUsersCount,
        totalNotices: data.totalNotices,
      });

      // latest 5 notices
      const noticeRes = await fetch(`${API_URL}/notices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const noticeData: Notice[] = await noticeRes.json();

      const latestFive = noticeData
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);

      setNotices(latestFive);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      const res = await fetch(`${API_URL}/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch feedback");
        return;
      }

      const data = await res.json();

      // Raw JSON console
      console.log("Feedback JSON Data:", data);
    } catch (error) {
      console.log("Feedback fetch error:", error);
    }
  };
  // feedback api call

  useEffect(() => {
    const token = (session?.user as { accessToken?: string })?.accessToken;

    if (token) {
      fetchAdminStats();
      fetchFeedbacks();
    }
  }, [session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const adminStats = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "New Registrations",
      value: stats.pendingUsersCount,
      icon: UserPlus,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Notices",
      value: stats.totalNotices,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8 p-2">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-slate-500 font-medium">
            Manage department users, approvals, and official notices.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/notices">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <FileText className="mr-2 h-4 w-4" /> Post Notice
            </Button>
          </Link>
          <Button variant="outline" className="border-slate-200">
            <Activity className="mr-2 h-4 w-4" /> View Logs
          </Button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-800">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🔔 LATEST NOTICES (Design untouched) */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50 p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" /> Latest
                Notices
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Review and verify new account requests.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Notice</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Posted By</th>
                    <th className="px-6 py-4 text-center">Image</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {notices.map((notice) => (
                    <tr
                      key={notice._id}
                      onClick={() => {
                        setSelectedNotice(notice);
                        setIsModalOpen(true);
                      }}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {notice.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {notice.description}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          {notice.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                          {notice.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-600">
                        {notice.postedBy}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <img
                            src={notice.imageUrl}
                            alt={notice.title}
                            className="h-10 w-10 rounded object-cover border"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Activity & Notifications */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {[
                  {
                    text: "Notice 'Final Results' published",
                    time: "2 mins ago",
                    type: "notice",
                  },
                  {
                    text: "5 students approved for 21st Batch",
                    time: "1 hour ago",
                    type: "approval",
                  },
                  {
                    text: "System backup completed",
                    time: "4 hours ago",
                    type: "system",
                  },
                  {
                    text: "New Teacher registration: Dr. Selim",
                    time: "Yesterday",
                    type: "user",
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 items-start relative pl-6">
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white shadow-sm flex-shrink-0 z-10" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">
                        {activity.text}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-primary"
              >
                Clear All Logs
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <GraduationCap size={120} />
            </div>
            <CardContent className="p-6 relative z-10">
              <h4 className="font-bold opacity-80 text-sm">System Health</h4>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-black italic">98%</span>
                <span className="text-xs font-bold mb-1 opacity-80 uppercase tracking-widest">
                  Stable
                </span>
              </div>
              <p className="text-[10px] mt-4 opacity-70 font-medium leading-relaxed italic">
                All department modules are running smoothly without any reported
                errors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedNotice && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNotice.title}</DialogTitle>
              </DialogHeader>

              <img
                src={selectedNotice.imageUrl}
                className="w-full h-60 object-cover rounded-md"
              />

              <p>{selectedNotice.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <strong>Category:</strong> {selectedNotice.category}
                </div>
                <div>
                  <strong>Priority:</strong> {selectedNotice.priority}
                </div>
                <div>
                  <strong>Posted By:</strong> {selectedNotice.postedBy}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedNotice.createdAt).toLocaleString()}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
