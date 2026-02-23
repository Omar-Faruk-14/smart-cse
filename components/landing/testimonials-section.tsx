"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const testimonials = [
  {
    name: "Rafiq Ahmed",
    role: "4th Year Student",
    content: "SmartCSE has completely transformed how I manage my academic life. The scheduling and attendance tracking features are incredibly helpful.",
    rating: 5,
    image: "/images/testimonial-2.jpg",
  },
  {
    name: "Dr. Fatema Khatun",
    role: "Associate Professor",
    content: "As a teacher, I can now focus more on teaching rather than administrative tasks. The resource sharing feature saves me hours every week.",
    rating: 5,
    image: "/images/testimonial-1.jpg",
  },
  {
    name: "Mohammad Karim",
    role: "Department Head",
    content: "The administrative panel gives us complete control and visibility over all department activities. It's exactly what we needed.",
    rating: 5,
    image: "/images/team-1.jpg",
  },
  {
    name: "Nusrat Jahan",
    role: "2nd Year Student",
    content: "I love how I can access all my course materials in one place. The notification system keeps me updated about everything.",
    rating: 5,
    image: "/images/testimonial-3.jpg",
  },
  {
    name: "Prof. Abdullah Al Mamun",
    role: "Senior Lecturer",
    content: "The grading system is intuitive and the analytics help me understand my students' performance better than ever before.",
    rating: 5,
    image: "/images/team-3.jpg",
  },
  {
    name: "Tasnim Rahman",
    role: "3rd Year Student",
    content: "Real-time attendance tracking means no more confusion about my attendance status. The mobile responsive design is a bonus!",
    rating: 5,
    image: "/images/team-2.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              Testimonials
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Loved by Students and Faculty
            </h2>
            <p className="text-muted-foreground">
              See what our users have to say about their experience with SmartCSE.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.1}>
              <Card className="border-border/50 bg-card transition-all hover:shadow-lg hover-lift h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {'"'}{testimonial.content}{'"'}
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 transition-transform hover:scale-110">
                      <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
