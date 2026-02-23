"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import logo from "@/public/cse.avif";
import Image from "next/image";

import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  Megaphone,
  Settings,
  LogOut,
  BarChart3,
  BriefcaseBusiness,
  BookOpen,
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  MessageSquareText,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const adminMenu = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },

    { icon: Users, label: "All Users", href: "/admin/users" },
    {
      icon: BriefcaseBusiness,
      label: "Faculty Members",
      href: "/admin/teachers",
    },
    { icon: BookOpen, label: "Course Catalog", href: "/admin/courses" },
    { icon: Calendar, label: "Class Routine", href: "/admin/routines" },
    { icon: GraduationCap, label: "Exam Results", href: "/admin/results" },
    { icon: Megaphone, label: "Official Notices", href: "/admin/notices" },
    { icon: CheckSquare, label: "Attendance Logs", href: "/admin/attendance" },
    {
      icon: MessageSquareText,
      label: "Student Feedback",
      href: "/admin/student-feedback",
    },

    { icon: Settings, label: "General Settings", href: "/admin/settings" },
    { icon: ShieldAlert, label: "Security Logs", href: "/admin/security-logs" },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 hidden lg:flex flex-col shadow-2xl">
        <SidebarContent adminMenu={adminMenu} pathname={pathname} />
      </aside>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-72 bg-[#0f172a] text-slate-300 shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent
              adminMenu={adminMenu}
              pathname={pathname}
              closeDrawer={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>

            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Department Control Center
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button>
              <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="SmartCSE Logo" width={20} height={20} className="object-contain" />
                View Site
              </Link>
            </Button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

/* ================= SIDEBAR CONTENT ================= */

function SidebarContent({
  adminMenu,
  pathname,
  closeDrawer,
}: {
  adminMenu: any[];
  pathname: string;
  closeDrawer?: () => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (closeDrawer) closeDrawer();
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* LOGO */}
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className=" p-2 rounded-xl">
            <Image
              src={logo}
              alt="SmartCSE Logo"
              width={60}
              height={34}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Smart<span className="text-primary">Admin</span>
          </span>
        </Link>

        {closeDrawer && (
          <button
            onClick={closeDrawer}
            className="text-slate-400 hover:text-white"
          >
            <X />
          </button>
        )}
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 mt-4 space-y-1 overflow-y-auto">
        {adminMenu.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "hover:bg-slate-800 hover:text-white text-slate-300"
                }`}
            >
              <item.icon
                className={`h-5 w-5 transition-colors
                  ${isActive ? "text-white" : "group-hover:text-primary"}`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PROFILE + LOGOUT */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {getInitials(session?.user?.name)}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs opacity-60">
              {(session?.user as any)?.role || "ADMIN"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-bold border border-red-500/20"
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>
    </>
  );
}
