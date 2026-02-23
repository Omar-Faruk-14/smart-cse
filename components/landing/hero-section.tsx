"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { FadeIn, ScaleIn, CountUp } from "@/components/ui/motion";

const highlights = [
  "Real-time Class Scheduling",
  "Automated Attendance Tracking",
  "Resource Sharing Platform",
  "Secure Grade Management",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <FadeIn delay={0}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-muted-foreground">
                  University of Barishal - CSE Department
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Streamline Your{" "}
                <span className="text-primary">Academic Journey</span> with
                SmartCSE
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                A comprehensive platform designed to simplify class scheduling,
                attendance tracking, resource sharing, and communication for
                students, teachers, and administrators.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mb-10 flex flex-col items-center lg:items-start justify-center lg:justify-start gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2 hover-lift">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent hover-lift"
                  onClick={() =>
                    window.open(
                      "https://youtu.be/cySVml6e_Fc?si=VAdKlyQrSkCGfO2v",
                      "_blank",
                    )
                  }
                >
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                {highlights.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="relative hidden lg:block">
            <ScaleIn delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl animate-pulse" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 hover-scale">
                  <Image
                    src="/images/hero-students.jpg"
                    alt="Students using SmartCSE platform"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                <FadeIn delay={0.5} direction="left">
                  <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          <CountUp end={10000} suffix="+" />
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Active Users
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.6} direction="right">
                  <div
                    className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-xl border border-border/50 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">99.9%</p>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </ScaleIn>
          </div>
        </div>
      </div>
    </section>
  );
}
