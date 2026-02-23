"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import logo from "@/public/cse.avif"
import Image from "next/image"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useUser()
  const router = useRouter()


  console.log(user)
  const isLoggedIn = !!user

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin"
    if (user?.role === "teacher") return "/teacher"
    return "/dashboard"
  }


  const getDashboardLabel = () => {
    if (user?.role === "admin") return "Admin Panel"
    if (user?.role === "teacher") return "Teacher Portal"
    return "Student Dashboard"
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200)
  }

  const handleLogOut = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/login"
    });
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* --- LOGO --- */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110">
            {/* <GraduationCap className="h-5 w-5 text-primary-foreground" /> */}
            <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">SmartCSE</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* --- AUTH / PROFILE SECTION --- */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="px-6 shadow-md hover:opacity-90">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <div 
              className="relative" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                className={cn(
                  "relative h-10 w-10 rounded-full p-0 transition-all duration-300",
                  isDropdownOpen ? "bg-muted ring-4 ring-primary/10" : "hover:bg-muted"
                )}
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user?.profileImage} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-popover p-2 shadow-xl"
                  >
                    <div className="px-3 py-3">
                      <p className="text-sm font-black italic uppercase tracking-tighter text-foreground truncate leading-none mb-1">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground truncate italic tracking-tight">
                        {user?.email}
                      </p>
                    </div>
                    <div className="h-px bg-border my-1" />
                    
                    <div className="space-y-1">
                      <Link 
                        href={getDashboardRoute()} 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black italic uppercase tracking-tight transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> 
                        {getDashboardLabel()}
                      </Link>
                    </div>

                    <div className="h-px bg-border my-1" />
                    
                    <button 
                      onClick={handleLogOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black italic uppercase tracking-tight text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> 
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* --- MOBILE MENU TOGGLE --- */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden transition-colors hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* --- MOBILE MENU CONTENT --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-2 border-t pt-4">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-primary text-white font-bold">{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black italic uppercase tracking-tighter truncate leading-none">{user?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate italic">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" asChild className="justify-start gap-2 h-12 font-black italic uppercase tracking-tight" onClick={() => setIsOpen(false)}>
                      <Link href={getDashboardRoute()}>
                        <LayoutDashboard className="h-4 w-4 text-primary" /> 
                        {getDashboardLabel()}
                      </Link>
                    </Button>
                    <Button variant="destructive" onClick={handleLogOut} className="gap-2 h-12 font-black italic uppercase tracking-tight shadow-lg">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full h-11 font-bold" onClick={() => setIsOpen(false)}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full h-11 font-bold shadow-md" onClick={() => setIsOpen(false)}>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}