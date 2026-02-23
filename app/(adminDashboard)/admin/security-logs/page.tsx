"use client";

import React, { useState, useMemo } from "react";
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
import { Search, ShieldCheck, User, Calendar, MapPin } from "lucide-react";

interface Log {
  id: string;
  user: string;
  action: string;
  ip: string;
  date: string;
}

const sampleLogs: Log[] = [
  {
    id: "1",
    user: "Admin",
    action: "Logged In",
    ip: "192.168.1.10",
    date: "2026-02-18 09:45 AM",
  },
  {
    id: "2",
    user: "Hafsa",
    action: "Updated Course",
    ip: "192.168.1.22",
    date: "2026-02-18 10:15 AM",
  },
];

export default function SecurityLogs() {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return sampleLogs.filter(
      (log) =>
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
          Security Logs
        </h1>
      </div>

      {/* Search */}
      <Card className="p-6 rounded-[2.5rem] border shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
          />
        </div>
      </Card>

      {/* Logs Content */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  User
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Action
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  IP Address
                </TableHead>
                <TableHead className="text-white font-bold py-6 italic uppercase">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-slate-50 transition-all"
                >
                  <TableCell className="font-black text-primary">
                    {log.user}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ===== MOBILE CARD VIEW ===== */}
        <div className="md:hidden p-4 space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-50 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              {/* User + Date */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-primary text-lg">{log.user}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {log.date}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  Action
                </p>
                <p className="font-bold text-slate-700">{log.action}</p>
              </div>

              {/* IP */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  IP Address
                </p>
                <p className="text-slate-600 font-medium">{log.ip}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
