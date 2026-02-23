"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Bell,
  Globe,
  FileText,
  Mail,
  Calendar,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const sections = [
  {
    id: "information-collection",
    icon: Database,
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes:

• Personal Information: Name, email address, phone number, and university ID
• Academic Information: Course enrollment, grades, attendance records
• Usage Data: How you interact with our platform, features used, and time spent
• Device Information: Browser type, IP address, and device identifiers
• Communication Data: Messages sent through our platform`,
  },
  {
    id: "information-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process and manage your academic records
• Send you notifications about classes, grades, and important updates
• Respond to your comments, questions, and support requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Personalize and improve your experience on our platform`,
  },
  {
    id: "information-sharing",
    icon: UserCheck,
    title: "Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With Your University: We share academic data with your educational institution as required for academic administration
• With Service Providers: We may share information with third-party vendors who help us operate our platform
• For Legal Reasons: When required by law or to protect our rights and safety
• With Your Consent: When you give us explicit permission to share your information`,
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    content: `We implement robust security measures to protect your personal information:

• Encryption: All data is encrypted in transit using SSL/TLS and at rest using AES-256
• Access Controls: Strict access controls ensure only authorized personnel can access data
• Regular Audits: We conduct regular security audits and penetration testing
• Backup Systems: Automatic backups ensure data recovery in case of incidents
• Compliance: We comply with industry standards including GDPR and educational data regulations`,
  },
  {
    id: "data-retention",
    icon: Calendar,
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes for which it was collected:

• Account Data: Retained while your account is active, deleted within 90 days of account closure
• Academic Records: Retained as required by educational regulations (typically 5-7 years after graduation)
• Usage Logs: Retained for 12 months for analytics and security purposes
• Communication Records: Retained for 2 years for support and compliance purposes`,
  },
  {
    id: "your-rights",
    icon: Shield,
    title: "Your Rights",
    content: `You have the following rights regarding your personal information:

• Access: Request a copy of the personal data we hold about you
• Correction: Request correction of inaccurate or incomplete data
• Deletion: Request deletion of your personal data (subject to legal obligations)
• Portability: Request transfer of your data to another service
• Objection: Object to certain types of data processing
• Withdrawal: Withdraw consent at any time where processing is based on consent`,
  },
  {
    id: "cookies",
    icon: Globe,
    title: "Cookies and Tracking",
    content: `We use cookies and similar tracking technologies to enhance your experience:

• Essential Cookies: Required for the platform to function properly
• Analytics Cookies: Help us understand how users interact with our platform
• Preference Cookies: Remember your settings and preferences
• Security Cookies: Help detect and prevent security threats

You can manage cookie preferences through your browser settings.`,
  },
  {
    id: "third-party",
    icon: FileText,
    title: "Third-Party Services",
    content: `Our platform may integrate with third-party services:

• Google Analytics: For usage analytics and insights
• Firebase: For authentication and real-time features
• Cloud Storage Providers: For secure file storage
• Payment Processors: For subscription payments (if applicable)

These services have their own privacy policies governing their use of your information.`,
  },
  {
    id: "children",
    icon: UserCheck,
    title: "Children's Privacy",
    content: `SmartCSE is designed for university students and staff who are typically 18 years or older. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete that information promptly.`,
  },
  {
    id: "changes",
    icon: Bell,
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:

• Posting the updated policy on our website
• Sending you an email notification
• Displaying a notice in the platform

We encourage you to review this policy periodically.`,
  },
];

const highlights = [
  {
    icon: Shield,
    title: "Data Protection",
    description: "Your data is protected with enterprise-grade security",
  },
  {
    icon: Lock,
    title: "No Data Selling",
    description: "We never sell your personal information to third parties",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear information about how we use your data",
  },
  {
    icon: UserCheck,
    title: "Your Control",
    description: "You have full control over your personal information",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 25, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Table of Contents
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {sections.map((section, index) => (
                <a
                  key={index}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-card transition-colors group"
                >
                  <span className="text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {sections.map((section, index) => (
              <div key={index} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact our Data Protection Officer.
            </p>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <p className="font-semibold text-foreground mb-2">
                  Data Protection Officer
                </p>
                <p className="text-muted-foreground">SmartCSE Team</p>
                <p className="text-primary">privacy@smartcse.edu</p>
                <p className="text-muted-foreground mt-4 text-sm">
                  CSE Department, University Campus
                  <br />
                  Dhaka, Bangladesh
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
              Related Documents
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/terms-of-service"
                className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors text-foreground"
              >
                Terms of Service
              </a>
              <a
                href="/help-center"
                className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors text-foreground"
              >
                Help Center
              </a>
              <a
                href="/contact"
                className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors text-foreground"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
