"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function StudentNoticesPage() {
  const { data: session } = useSession();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch(`${apiUrl}/notices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchNotices();
  }, [session, apiUrl]);

  // Priority based colors
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-3">
            <Bell className="text-blue-600 w-8 h-8" /> Notice{" "}
            <span className="text-blue-600">Board</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
            Stay updated with the latest campus announcements
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search notices..."
            className="pl-10 rounded-2xl border-2 border-slate-100 focus:border-blue-600 transition-all font-medium italic"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid gap-6">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <Card
              key={notice._id}
              className="group border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white transition-all hover:scale-[1.01]"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section (If exists) */}
                {notice.imageUrl && (
                  <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                    <img
                      src={notice.imageUrl}
                      alt={notice.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${getPriorityColor(notice.priority)} px-3 py-1 rounded-lg font-black italic uppercase text-[10px] border shadow-sm`}
                      >
                        {notice.priority}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardContent className="p-8 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 text-[9px] font-black italic uppercase text-slate-400 border-slate-200"
                    >
                      <Tag className="w-3 h-3 mr-1" /> {notice.category}
                    </Badge>
                    <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                      <Calendar className="w-3 h-3 mr-1 text-blue-500" />
                      {format(new Date(notice.createdAt), "PPP")}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black italic uppercase text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h2>

                  <p className="text-slate-500 font-medium italic leading-relaxed mb-6 line-clamp-3">
                    {notice.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                          Posted By
                        </p>
                        <p className="text-xs font-black italic text-slate-700">
                          {notice.postedBy}
                        </p>
                      </div>
                    </div>

                    {notice.imageUrl && (
                      <a
                        href={notice.imageUrl}
                        target="_blank"
                        className="flex items-center gap-2 text-[10px] font-black italic uppercase text-blue-600 hover:underline"
                      >
                        View Full Image <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
            <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="font-black italic text-slate-300 uppercase tracking-widest">
              No notices found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
