"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  BookOpen,
  Users,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  HelpCircle,
  Video,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of SmartCSE",
    articles: 12,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Account & Profile",
    description: "Manage your account settings",
    articles: 8,
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Calendar,
    title: "Schedule & Classes",
    description: "Class scheduling and timetables",
    articles: 15,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: FileText,
    title: "Resources & Materials",
    description: "Upload and access study materials",
    articles: 10,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    icon: BarChart3,
    title: "Grades & Reports",
    description: "Understanding grade reports",
    articles: 9,
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Messaging and notifications",
    articles: 7,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Settings,
    title: "Settings & Preferences",
    description: "Customize your experience",
    articles: 11,
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Keep your account safe",
    articles: 6,
    color: "bg-chart-3/10 text-chart-3",
  },
];

const popularArticles = [
  {
    title: "How to reset your password",
    category: "Account",
    views: 1250,
  },
  {
    title: "Understanding your class schedule",
    category: "Schedule",
    views: 980,
  },
  {
    title: "Uploading assignments and resources",
    category: "Resources",
    views: 875,
  },
  {
    title: "Viewing and downloading grade reports",
    category: "Grades",
    views: 760,
  },
  {
    title: "Setting up notifications",
    category: "Settings",
    views: 650,
  },
];

const faqs = [
  {
    question: "How do I create an account on SmartCSE?",
    answer:
      "To create an account, click on the 'Get Started' button on the homepage. Fill in your university email, create a password, and select your role (Student, Teacher, or Admin). You'll receive a verification email to confirm your account.",
  },
  {
    question: "Can I access SmartCSE on my mobile device?",
    answer:
      "Yes! SmartCSE is fully responsive and works on all devices including smartphones and tablets. You can access all features through your mobile browser, and we're also developing dedicated mobile apps for iOS and Android.",
  },
  {
    question: "How do I view my class attendance records?",
    answer:
      "Navigate to the 'Attendance' section from your dashboard. You'll see a summary of your attendance for all courses. Click on any course to view detailed attendance records including dates and status.",
  },
  {
    question: "What should I do if I forgot my password?",
    answer:
      "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. The link is valid for 24 hours. If you don't receive the email, check your spam folder.",
  },
  {
    question: "How can teachers upload course materials?",
    answer:
      "Teachers can upload materials by going to 'Resources' > 'Upload New'. Select the course, add a title and description, then upload files (PDF, DOC, PPT, etc.). You can also organize materials into folders for easy access.",
  },
  {
    question: "Is my data secure on SmartCSE?",
    answer:
      "Absolutely! We use industry-standard encryption (SSL/TLS) for all data transmission. Your personal information is stored securely with regular backups. We comply with educational data privacy regulations and never share your data with third parties.",
  },
];

const videoTutorials = [
  {
    title: "Complete Platform Overview",
    duration: "12:45",
    thumbnail: "/images/dashboard-preview.jpg",
  },
  {
    title: "Managing Your Schedule",
    duration: "8:30",
    thumbnail: "/images/schedule-calendar.jpg",
  },
  {
    title: "Uploading & Sharing Resources",
    duration: "6:15",
    thumbnail: "/images/resources-library.jpg",
  },
  {
    title: "Understanding Grade Reports",
    duration: "7:20",
    thumbnail: "/images/grades-analytics.jpg",
  },
];

const quickTips = [
  {
    icon: Zap,
    title: "Use keyboard shortcuts",
    description: "Press '?' anywhere to see available shortcuts",
  },
  {
    icon: Clock,
    title: "Set reminders",
    description: "Never miss a class or deadline with smart reminders",
  },
  {
    icon: Lightbulb,
    title: "Customize your dashboard",
    description: "Drag and drop widgets to personalize your view",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background">
 

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/help-center.jpg"
            alt="Help Center"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Help Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              How can we help you today?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our knowledge base or browse categories to find answers
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 pr-4 py-6 text-lg rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {quickTips.map((tip, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <tip.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers organized by topic
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {category.articles} articles
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Popular Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-md transition-all"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Video Tutorials
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {videoTutorials.map((video, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative h-32">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-foreground/80">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium text-foreground">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  All Systems Operational
                </h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: 5 minutes ago
                </p>
              </div>
            </div>
            <Button variant="outline">View System Status</Button>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to assist you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Email Support
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help via email within 24 hours
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Send Email
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Live Chat
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our team in real-time
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-chart-3/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-chart-3" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Phone Support
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mon-Fri, 9AM-6PM (BDT)
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  +880 1234-567890
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Community</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Join Our Community
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with other SmartCSE users, share tips, and get help from
                the community. Our forums are a great place to learn and
                contribute.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">
                    Ask questions and get answers from experts
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">
                    Share your knowledge and help others
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">
                    Stay updated with platform news and updates
                  </span>
                </div>
              </div>
              <Button className="mt-8" size="lg">
                Join Community Forum
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/images/about-team.jpg"
                alt="Community"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">
            Was this helpful?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Help us improve our help center by sharing your feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Give Feedback
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Suggest an Article
            </Button>
          </div>
        </div>
      </section>

     
    </main>
  );
}
