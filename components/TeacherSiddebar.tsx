"use client"

import logo from "@/public/cse.avif"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Calendar, ClipboardCheck, BarChart3, MessageSquareText,
  Settings, LogOut, Bell, BookOpen, Loader2, Users, User, Menu, X, Home
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/context/UserContext"

const teacherNavItems = [
  { href: "/teacher", label: "Overview", icon: LayoutDashboard },
  { href: "/teacher/notices", label: "Notices", icon: Bell },
  { href: "/teacher/routines", label: "Class Routine", icon: Calendar },
  { href: "/teacher/students-overview", label: "Students", icon: Users },
  { href: "/teacher/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/teacher/results", label: "Results", icon: BarChart3 },
  { href: "/teacher/student-feedback", label: "Student Feedback", icon: MessageSquareText },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)       // mobile drawer state
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ redirect: false })
    router.push("/login")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300">
      {/* LOGO + MOBILE CLOSE */}
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
          <div className="p-2 rounded-xl">
            <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Smart<span className="text-blue-500">Teacher</span>
          </span>
        </Link>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6 text-slate-400" />
        </button>
      </div>

      {/* MENU */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Teacher Panel
        </div>
        <nav className="space-y-1">
          {teacherNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group font-medium",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "group-hover:text-blue-500"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* PROFILE + LOGOUT */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden">
            {user?.profileImage ? (
              <img src={user.profileImage} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-3 flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10"
        >
          {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a] border-b border-slate-800 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(true)} className="p-2 text-slate-300">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-black text-white italic">SMART TEACHER</span>
        </div>
        <Link href="/" className="p-2 text-slate-300 bg-slate-800 rounded-lg">
          <Home className="h-5 w-5" />
        </Link>
      </header>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          {/* drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-80 shadow-2xl transition-transform">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* DESKTOP STATIC SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 lg:flex flex-col border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* MOBILE SPACER */}
      <div className="h-16 lg:hidden" />
    </>
  )
}