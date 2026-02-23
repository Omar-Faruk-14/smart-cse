"use client"

import { Users, BookOpen, Clock, Award } from "lucide-react"
import { FadeIn, CountUp } from "@/components/ui/motion"

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Active Students",
    description: "Learning together",
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: "+",
    label: "Courses",
    description: "Comprehensive curriculum",
  },
  {
    icon: Clock,
    value: 10,
    suffix: "K+",
    label: "Hours Saved",
    description: "Through automation",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "User approval rate",
  },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <div className="text-center hover-lift">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform hover:scale-110">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground md:text-4xl">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 font-medium text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
