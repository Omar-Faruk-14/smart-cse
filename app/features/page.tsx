"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Clock,
  FileText,
  Video,
  Award,
  Settings,
  Cloud,
  Lock,
  Layers,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { FadeIn, ScaleIn } from "@/components/ui/motion";

const mainFeatures = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "AI-powered class scheduling that automatically detects conflicts and suggests optimal time slots for all courses.",
    benefits: [
      "Automatic conflict detection",
      "Room optimization",
      "Teacher availability sync",
      "Student preference consideration",
    ],
  },
  {
    icon: Users,
    title: "Attendance Management",
    description:
      "Modern attendance tracking with QR codes, biometric integration, and real-time analytics for better monitoring.",
    benefits: [
      "QR code check-in",
      "Biometric support",
      "Real-time tracking",
      "Automated reports",
    ],
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Centralized repository for all academic materials including notes, slides, videos, and research papers.",
    benefits: [
      "Cloud storage",
      "Version control",
      "Easy sharing",
      "Search & filter",
    ],
  },
  {
    icon: BarChart3,
    title: "Grade Analytics",
    description:
      "Comprehensive grading system with detailed analytics, GPA calculation, and performance insights.",
    benefits: [
      "Auto GPA calculation",
      "Performance trends",
      "Comparative analysis",
      "Export reports",
    ],
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description:
      "Integrated messaging platform for seamless communication between students, teachers, and administration.",
    benefits: [
      "Real-time chat",
      "Group discussions",
      "File sharing",
      "Announcements",
    ],
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Intelligent notification system that keeps everyone informed about important updates and deadlines.",
    benefits: [
      "Push notifications",
      "Email alerts",
      "SMS integration",
      "Custom preferences",
    ],
  },
];

const additionalFeatures = [
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure access control with customizable permissions for different user roles.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Access the platform from any device with our fully responsive design.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for multiple languages including Bengali and English.",
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "Optimized for speed with instant page loads and real-time updates.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your academic data anytime, anywhere with 99.9% uptime.",
  },
  {
    icon: FileText,
    title: "Report Generation",
    description: "Generate detailed reports for attendance, grades, and performance.",
  },
  {
    icon: Video,
    title: "Video Integration",
    description: "Seamless integration with video conferencing for online classes.",
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Gamification features to encourage student engagement and participation.",
  },
  {
    icon: Settings,
    title: "Customizable",
    description: "Flexible settings to adapt the platform to your institution's needs.",
  },
  {
    icon: Cloud,
    title: "Cloud Backup",
    description: "Automatic cloud backups to ensure your data is always safe.",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description: "End-to-end encryption for all sensitive academic data.",
  },
  {
    icon: Layers,
    title: "API Integration",
    description: "RESTful APIs for integration with existing institutional systems.",
  },
];

const comparisonData = [
  { feature: "Class Scheduling", smartcse: true, traditional: false },
  { feature: "Real-time Attendance", smartcse: true, traditional: false },
  { feature: "Digital Resources", smartcse: true, traditional: false },
  { feature: "Automated Grading", smartcse: true, traditional: false },
  { feature: "Instant Communication", smartcse: true, traditional: false },
  { feature: "Mobile Access", smartcse: true, traditional: false },
  { feature: "Analytics Dashboard", smartcse: true, traditional: false },
  { feature: "Cloud Storage", smartcse: true, traditional: false },
];

const useCases = [
  {
    title: "For Students",
    description: "Access schedules, track attendance, download resources, and communicate with teachers effortlessly.",
    features: ["View class schedule", "Check attendance", "Access materials", "Submit assignments"],
  },
  {
    title: "For Teachers",
    description: "Manage classes, track student progress, share resources, and communicate with students easily.",
    features: ["Manage attendance", "Upload resources", "Grade assignments", "Send announcements"],
  },
  {
    title: "For Administrators",
    description: "Oversee all academic activities, generate reports, and manage the entire department efficiently.",
    features: ["System overview", "Generate reports", "Manage users", "Configure settings"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

{/* Hero Section */}
  <section className="relative py-20 lg:py-28 overflow-hidden">
  <div className="absolute inset-0 z-0">
    <Image
      src="/images/features-tech.jpg"
      alt="SmartCSE Features"
      fill
      className="object-cover opacity-10"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-accent/20" />
  </div>
<div className="container mx-auto px-4 relative z-10">
  <div className="max-w-3xl mx-auto text-center">
  <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
  Powerful Features
  </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Everything You Need for{" "}
              <span className="text-primary">Academic Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Discover the comprehensive suite of tools designed to streamline
              academic management and enhance the learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Request Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Tools for Modern Education
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a comprehensive set of features designed to
              meet the needs of modern academic institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Smart Dashboard
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                All Your Academic Data in One Place
              </h2>
              <p className="text-muted-foreground mb-8">
                Our intuitive dashboard provides a comprehensive overview of all
                academic activities, helping you make informed decisions quickly.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time statistics and analytics",
                  "Customizable widgets and layouts",
                  "Quick access to important actions",
                  "Visual performance indicators",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
                <div className="bg-card rounded-xl shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Dashboard Overview</h3>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-primary">1,247</p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-accent">92%</p>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-primary">48</p>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-accent">3.67</p>
                      <p className="text-sm text-muted-foreground">Average GPA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
              More Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              And Much More...
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore additional features that make SmartCSE the complete
              solution for academic management.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-border/50"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              Why SmartCSE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              SmartCSE vs Traditional Methods
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how SmartCSE transforms academic management compared to
              traditional approaches.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-3 bg-secondary/50 p-4 font-semibold">
                <div>Feature</div>
                <div className="text-center">SmartCSE</div>
                <div className="text-center">Traditional</div>
              </div>
              {comparisonData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 p-4 border-t border-border/50 items-center"
                >
                  <div className="text-foreground">{item.feature}</div>
                  <div className="text-center">
                    <CheckCircle2 className="h-5 w-5 text-accent mx-auto" />
                  </div>
                  <div className="text-center">
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 mx-auto" />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
              Use Cases
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Designed for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SmartCSE caters to the unique needs of students, teachers, and
              administrators alike.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-shadow border-border/50"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-3 gap-4">
                {[
                  "Google",
                  "Microsoft",
                  "Zoom",
                  "Slack",
                  "Firebase",
                  "AWS",
                ].map((brand, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border/50 rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    <span className="font-semibold text-muted-foreground">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Integrations
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Works with Your Favorite Tools
              </h2>
              <p className="text-muted-foreground mb-8">
                SmartCSE seamlessly integrates with popular tools and platforms
                you already use, making the transition smooth and effortless.
              </p>
              <Button asChild>
                <Link href="/contact">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 text-balance">
              {`"SmartCSE has revolutionized how we manage our department. The
              features are exactly what we needed to modernize our academic
              processes."`}
            </blockquote>
            <div>
              <p className="font-semibold text-foreground">Dr. Rahman Ahmed</p>
              <p className="text-muted-foreground">
                Head of CSE Department, Example University
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of institutions already using SmartCSE to
              streamline their academic management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
