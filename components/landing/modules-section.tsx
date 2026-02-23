"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  BookMarked,
  PieChart,
  MessageCircle
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const modules = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description: "Access schedules, check attendance, view grades, download resources, and stay connected with classmates.",
    features: ["View Schedule", "Check Grades", "Download Materials", "Track Attendance"],
    badge: "Most Popular",
  },
  {
    icon: Users,
    title: "Teacher Dashboard",
    description: "Manage classes, mark attendance, upload resources, input grades, and communicate with students.",
    features: ["Manage Classes", "Mark Attendance", "Upload Resources", "Grade Students"],
    badge: "Essential",
  },
  {
    icon: ShieldCheck,
    title: "Admin Panel",
    description: "Full administrative control over users, courses, schedules, and system-wide settings.",
    features: ["User Management", "Course Setup", "System Config", "Reports"],
    badge: "Full Access",
  },
  {
    icon: BookMarked,
    title: "Resource Library",
    description: "Centralized repository for all academic materials organized by subject and course.",
    features: ["Lecture Notes", "Books & PDFs", "Video Lectures", "Past Papers"],
    badge: null,
  },
  {
    icon: PieChart,
    title: "Analytics Hub",
    description: "Comprehensive analytics and reports on attendance, grades, and academic performance.",
    features: ["Attendance Reports", "Grade Analytics", "Performance Trends", "Export Data"],
    badge: null,
  },
  {
    icon: MessageCircle,
    title: "Communication Center",
    description: "Unified messaging and notification system for seamless communication across the department.",
    features: ["Announcements", "Direct Messages", "Group Chats", "Notifications"],
    badge: null,
  },
]

export function ModulesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              Platform Modules
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Powerful Modules for Every Role
            </h2>
            <p className="text-muted-foreground">
              SmartCSE offers dedicated modules tailored for students, teachers, and administrators
              to meet their specific needs.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <FadeIn key={module.title} delay={index * 0.1}>
              <Card className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/20 hover:shadow-xl hover-lift h-full">
                {module.badge && (
                  <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground animate-pulse">
                    {module.badge}
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                    <module.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {module.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-2">
                    {module.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
