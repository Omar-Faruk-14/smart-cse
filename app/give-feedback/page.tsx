"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  HelpCircle,
  Send,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const feedbackTypes = [
  {
    id: "general",
    icon: MessageSquare,
    title: "General Feedback",
    description: "Share your overall thoughts about SmartCSE",
  },
  {
    id: "feature",
    icon: Lightbulb,
    title: "Feature Request",
    description: "Suggest new features or improvements",
  },
  {
    id: "bug",
    icon: Bug,
    title: "Report a Bug",
    description: "Let us know about any issues you encountered",
  },
  {
    id: "support",
    icon: HelpCircle,
    title: "Support Request",
    description: "Get help with a specific problem",
  },
];

const satisfactionLevels = [
  { value: 5, label: "Very Satisfied", emoji: "Excellent" },
  { value: 4, label: "Satisfied", emoji: "Good" },
  { value: 3, label: "Neutral", emoji: "Okay" },
  { value: 2, label: "Dissatisfied", emoji: "Poor" },
  { value: 1, label: "Very Dissatisfied", emoji: "Bad" },
];

const recentUpdates = [
  {
    title: "Dark Mode Support",
    description: "Based on user feedback, we added dark mode support",
    status: "Implemented",
  },
  {
    title: "Mobile App",
    description: "Native mobile apps are in development",
    status: "In Progress",
  },
  {
    title: "Calendar Export",
    description: "Export your schedule to Google Calendar",
    status: "Implemented",
  },
  {
    title: "Offline Mode",
    description: "Access resources without internet",
    status: "Planned",
  },
];

const stats = [
  { icon: MessageSquare, value: "5,000+", label: "Feedback Received" },
  { icon: CheckCircle, value: "89%", label: "Issues Resolved" },
  { icon: Lightbulb, value: "120+", label: "Features Implemented" },
  { icon: Clock, value: "24h", label: "Avg Response Time" },
];

const testimonials = [
  {
    name: "Rafiq Ahmed",
    role: "Student, CSE 4th Year",
    content:
      "I suggested the dark mode feature and they actually implemented it within a month! Great team.",
    avatar: "/images/testimonial-2.jpg",
  },
  {
    name: "Dr. Fatema Akter",
    role: "Professor",
    content:
      "The team is very responsive to feedback. They fixed the grade upload issue within hours.",
    avatar: "/images/testimonial-1.jpg",
  },
  {
    name: "Tanvir Hasan",
    role: "Student, CSE 3rd Year",
    content:
      "Love how they listen to students. The mobile-friendly update made a huge difference.",
    avatar: "/images/testimonial-3.jpg",
  },
];

export default function GiveFeedbackPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank You for Your Feedback!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We appreciate you taking the time to help us improve SmartCSE.
                Your feedback has been received and will be reviewed by our
                team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setSubmitted(false)}>
                  Submit Another
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Return Home</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact-support.jpg"
            alt="Feedback"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">We Value Your Opinion</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Help Us Improve SmartCSE
            </h1>
            <p className="text-xl text-muted-foreground">
              Your feedback shapes the future of our platform. Share your
              thoughts, suggestions, or report any issues.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Type Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What type of feedback do you have?
              </h2>
              <p className="text-muted-foreground">
                Select a category to help us better understand your feedback
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {feedbackTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedType === type.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        selectedType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <type.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Share Your Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feature">Related Feature</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a feature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="schedule">Schedule</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                          <SelectItem value="resources">Resources</SelectItem>
                          <SelectItem value="grades">Grades</SelectItem>
                          <SelectItem value="messages">Messages</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief summary of your feedback"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Feedback</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your feedback in detail..."
                      rows={6}
                    />
                  </div>

                  {/* Satisfaction Rating */}
                  <div className="space-y-4">
                    <Label>How satisfied are you with SmartCSE?</Label>
                    <div className="flex flex-wrap gap-3">
                      {satisfactionLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setSatisfaction(level.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            satisfaction === level.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card hover:bg-secondary border-border"
                          }`}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              satisfaction === level.value
                                ? "fill-primary-foreground"
                                : ""
                            }`}
                          />
                          <span className="text-sm">{level.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reactions */}
                  <div className="space-y-4">
                    <Label>Quick reactions (optional)</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="outline" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Love it
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Great design
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Very useful
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Needs work
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2 h-5 w-5" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">You Asked, We Delivered</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Updates Based on Your Feedback
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how your feedback has helped shape SmartCSE
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {recentUpdates.map((update, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Badge
                    variant={
                      update.status === "Implemented"
                        ? "default"
                        : update.status === "In Progress"
                          ? "secondary"
                          : "outline"
                    }
                    className="mb-4"
                  >
                    {update.status}
                  </Badge>
                  <h3 className="font-semibold text-foreground mb-2">
                    {update.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {update.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Users Say
            </h2>
            <p className="text-muted-foreground">
              Hear from users who have shared their feedback
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Join Our Beta Program</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get early access to new features and help shape the future of
            SmartCSE by joining our beta testing community.
          </p>
          <Button size="lg" variant="secondary">
            Join Beta Program
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Feedback FAQ
              </h2>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    How long until I get a response?
                  </h3>
                  <p className="text-muted-foreground">
                    We typically respond to feedback within 24-48 hours. For
                    urgent issues, please mark them as such in your submission.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Will my feedback be implemented?
                  </h3>
                  <p className="text-muted-foreground">
                    We review all feedback and prioritize based on user demand
                    and feasibility. While we cant implement everything, we
                    consider all suggestions seriously.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Can I track the status of my feedback?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! If you provide your email, well send you updates on the
                    status of your feedback and notify you when its addressed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
