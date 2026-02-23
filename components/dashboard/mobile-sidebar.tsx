"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  MessageSquareText,
  LogOut,
  Bell,
  BookOpen,
  Loader2,
  User, // Fallback icon এর জন্য যোগ করা হয়েছে
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useUser } from "@/context/UserContext" // Context ইমপোর্ট

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/notices", label: "Official Notices", icon: Bell },
  { href: "/dashboard/schedule", label: "Class Routine", icon: Calendar },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/grades", label: "Exam Results", icon: BarChart3 },
  { href: "/dashboard/resources", label: "Resources", icon: FolderOpen },
  { href: "/dashboard/feedback", label: "Teacher Feedback", icon: MessageSquareText },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { user } = useUser() // Context থেকে ইউজার ডাটা নিচ্ছি
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true) // লোডিং স্টেট ট্রু করছি
    await signOut({
      redirect: false,
      callbackUrl: "/login"
    });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col bg-[#0f172a] text-slate-300">
      {/* Header */}
<SheetHeader className="flex h-20 flex-row items-center gap-3 border-b border-slate-800 px-6 text-left">
  <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
      <GraduationCap className="h-6 w-6 text-white" />
    </div>
    <SheetTitle className="text-2xl font-black text-white tracking-tighter cursor-pointer">
      Smart<span className="text-blue-500">Student</span>
    </SheetTitle>
  </Link>
</SheetHeader>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Academic Menu
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-slate-400"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Profile & Sign Out Section */}
      <div className="mt-auto border-t border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3 mb-6 px-2">
          {/* প্রোফাইল ইমেজ সেকশন */}
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border-2 border-slate-700 overflow-hidden shrink-0">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <User className="h-5 w-5 text-slate-400" />
            )}
          </div>
          
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || "Loading..."}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || "Fetching email..."}
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-bold border border-red-500/20 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  )
}