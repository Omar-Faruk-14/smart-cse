"use client"

import { 
  Calendar, 
  ClipboardCheck, 
  MessageSquare, 
  FolderOpen, 
  BarChart3, 
  Bell,
  Shield,
  Smartphone
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/ui/motion"

const features = [
  {
    icon: Calendar,
    title: "Class Scheduling",
    description: "Real-time scheduling system for students and faculty to view and manage classes, exams, and academic events.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Management",
    description: "Automated attendance tracking with real-time reports and alerts for students with low attendance.",
  },
  {
    icon: MessageSquare,
    title: "Communication Tools",
    description: "Integrated messaging platform for announcements, notes, and direct communication between students and teachers.",
  },
  {
    icon: FolderOpen,
    title: "Resource Sharing",
    description: "Upload and share study materials, lecture notes, and academic resources organized by subject or course.",
  },
  {
    icon: BarChart3,
    title: "Grade Management",
    description: "Teachers can input grades, and students can view their academic performance with detailed analytics.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Stay updated with instant notifications for class changes, exam schedules, events, and announcements.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with role-based access control to protect sensitive academic data.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Access the platform from any device with our fully responsive web design.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              Features
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Everything You Need for Academic Excellence
            </h2>
            <p className="text-muted-foreground">
              SmartCSE provides a comprehensive suite of tools to streamline academic management
              and enhance productivity for everyone in the department.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="group border-border/50 bg-card transition-all hover:border-primary/20 hover:shadow-lg hover-lift h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
