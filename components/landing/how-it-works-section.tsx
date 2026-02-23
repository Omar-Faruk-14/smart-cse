"use client"

import { UserPlus, Settings, Rocket, Trophy } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up as a student, teacher, or administrator with your university credentials.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Setup Your Profile",
    description: "Complete your profile with your academic details, courses, and preferences.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Access All Features",
    description: "Start using scheduling, attendance, resources, and communication tools instantly.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Achieve Excellence",
    description: "Track your progress, improve productivity, and excel in your academic journey.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              How It Works
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Get Started in Four Simple Steps
            </h2>
            <p className="text-muted-foreground">
              Join SmartCSE in minutes and transform how you manage your academic activities.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-border lg:block" />
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <FadeIn key={step.step} delay={index * 0.15}>
                <div className="relative text-center">
                  <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg ring-4 ring-background transition-all hover:scale-110 hover:shadow-xl">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="mb-2 text-sm font-bold text-primary">Step {step.step}</div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="absolute right-0 top-8 hidden -translate-y-1/2 translate-x-1/2 text-2xl text-muted-foreground/30 lg:block">
                      →
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
