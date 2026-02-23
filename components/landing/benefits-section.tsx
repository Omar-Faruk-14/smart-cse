"use client"

import { Check } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const benefits = {
  students: {
    title: "For Students",
    items: [
      "Access class schedules anytime, anywhere",
      "Track attendance records in real-time",
      "Download study materials instantly",
      "View grades and academic progress",
      "Receive instant notifications",
      "Connect with teachers easily",
    ],
  },
  teachers: {
    title: "For Teachers",
    items: [
      "Manage multiple classes efficiently",
      "Mark attendance with one click",
      "Upload and organize resources",
      "Input and calculate grades",
      "Send announcements to students",
      "Track class performance analytics",
    ],
  },
  admins: {
    title: "For Administrators",
    items: [
      "Complete user management",
      "Configure courses and schedules",
      "Generate comprehensive reports",
      "Monitor system-wide activities",
      "Manage department resources",
      "Ensure data security",
    ],
  },
}

export function BenefitsSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              Benefits
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Designed for Everyone in the Department
            </h2>
            <p className="text-muted-foreground">
              SmartCSE delivers tangible benefits for students, teachers, and administrators alike.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {Object.entries(benefits).map(([key, benefit], index) => (
            <FadeIn key={key} delay={index * 0.15}>
              <div className="rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg hover-lift h-full">
                <h3 className="mb-6 text-xl font-semibold text-foreground">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={item} className="flex items-start gap-3 group">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 transition-all group-hover:scale-110 group-hover:bg-accent/30">
                        <Check className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
