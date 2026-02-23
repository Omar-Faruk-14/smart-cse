"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FadeIn, ScaleIn } from "@/components/ui/motion"

export function CTASection() {
  return (
    <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Transform Your Academic Experience?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
              Join hundreds of students and faculty members who are already using SmartCSE 
              to streamline their academic journey.
            </p>
            <ScaleIn delay={0.2}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="gap-2 bg-background text-foreground hover:bg-background/90 hover-lift"
                >
                  <Link href="/register">
                    Get Started Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover-lift"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </ScaleIn>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
