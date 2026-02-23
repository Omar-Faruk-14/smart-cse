"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Scale,
  Users,
  Shield,
  Ban,
  RefreshCw,
  Gavel,
  Mail,
  Download,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const sections = [
  {
    id: "acceptance",
    icon: CheckCircle,
    title: "1. Acceptance of Terms",
    content: `By accessing or using SmartCSE ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.

These Terms of Service apply to all users of the platform, including without limitation users who are students, teachers, administrators, and other visitors to the platform.

We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new terms.`,
  },
  {
    id: "eligibility",
    icon: Users,
    title: "2. Eligibility",
    content: `To use SmartCSE, you must:

• Be at least 18 years of age, or the age of legal majority in your jurisdiction
• Be currently enrolled as a student, employed as faculty, or authorized as staff at a participating educational institution
• Have the legal capacity to enter into these Terms of Service
• Not be barred from using the platform under applicable law

By using the platform, you represent and warrant that you meet all eligibility requirements. If you are using the platform on behalf of an organization, you represent that you have the authority to bind that organization to these terms.`,
  },
  {
    id: "account",
    icon: Shield,
    title: "3. Account Registration and Security",
    content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of these Terms.

You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use of your account
• Ensuring that your account information is accurate and up-to-date

We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious activity. You may not use another person's account without permission.`,
  },
  {
    id: "acceptable-use",
    icon: CheckCircle,
    title: "4. Acceptable Use Policy",
    content: `You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree NOT to:

• Use the Platform in any way that violates any applicable law or regulation
• Impersonate any person or entity, or falsely state or misrepresent your affiliation
• Upload or transmit viruses, malware, or other malicious code
• Attempt to gain unauthorized access to any portion of the Platform
• Interfere with or disrupt the Platform or servers connected to it
• Collect or harvest any information from the Platform without authorization
• Use the Platform for any commercial purpose without our prior written consent
• Engage in any conduct that restricts or inhibits anyone's use of the Platform`,
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "5. Prohibited Activities",
    content: `The following activities are strictly prohibited on SmartCSE:

Academic Misconduct:
• Sharing answers to exams or assignments
• Submitting work that is not your own
• Helping others engage in academic dishonesty

Content Violations:
• Posting offensive, defamatory, or inappropriate content
• Sharing copyrighted material without authorization
• Distributing spam or unsolicited communications

Security Violations:
• Attempting to hack or compromise the platform
• Sharing login credentials with unauthorized users
• Circumventing any security measures

Violations may result in immediate account suspension or termination, and may be reported to your educational institution.`,
  },
  {
    id: "intellectual-property",
    icon: FileText,
    title: "6. Intellectual Property Rights",
    content: `The Platform and its original content, features, and functionality are owned by SmartCSE and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

User Content:
• You retain ownership of content you upload to the Platform
• By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the Platform
• You represent that you have the right to share any content you upload

Course Materials:
• Course materials uploaded by instructors remain the property of the instructor or institution
• Students may not redistribute or share course materials without authorization`,
  },
  {
    id: "privacy",
    icon: Shield,
    title: "7. Privacy and Data Protection",
    content: `Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, explains how we collect, use, and protect your personal information.

By using the Platform, you consent to:
• The collection and use of your information as described in our Privacy Policy
• Receiving electronic communications from us regarding your account and the Platform
• The storage and processing of your data on servers located in various jurisdictions

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.`,
  },
  {
    id: "termination",
    icon: RefreshCw,
    title: "8. Termination",
    content: `We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including without limitation:

• Breach of these Terms of Service
• Violation of our Acceptable Use Policy
• Request from law enforcement or government agencies
• Extended periods of inactivity
• Unexpected technical or security issues

Upon termination:
• Your right to use the Platform will immediately cease
• We may delete your account and associated data (subject to legal retention requirements)
• Provisions that by their nature should survive termination will remain in effect`,
  },
  {
    id: "disclaimers",
    icon: AlertTriangle,
    title: "9. Disclaimers and Limitations",
    content: `THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND.

We do not warrant that:
• The Platform will be uninterrupted, timely, secure, or error-free
• The results obtained from using the Platform will be accurate or reliable
• Any errors in the Platform will be corrected

LIMITATION OF LIABILITY:
In no event shall SmartCSE, its directors, employees, partners, agents, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.

Our total liability shall not exceed the amount paid by you, if any, for accessing the Platform during the twelve (12) months preceding the claim.`,
  },
  {
    id: "governing-law",
    icon: Gavel,
    title: "10. Governing Law and Disputes",
    content: `These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.

Dispute Resolution:
• Any disputes arising from these Terms will first be attempted to be resolved through good-faith negotiation
• If negotiation fails, disputes will be submitted to binding arbitration
• The arbitration will be conducted in Dhaka, Bangladesh
• The language of arbitration will be English or Bengali

You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.`,
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "11. Changes to Terms",
    content: `We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.

What constitutes a material change will be determined at our sole discretion. By continuing to access or use the Platform after revisions become effective, you agree to be bound by the revised terms.

We encourage you to review these Terms periodically for any changes. Changes to these Terms are effective when they are posted on this page.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "12. Contact Information",
    content: `If you have any questions about these Terms of Service, please contact us:

SmartCSE Legal Team
Email: legal@smartcse.edu
Phone: +880 1234-567890

Mailing Address:
CSE Department
University Campus
Dhaka, Bangladesh

For general support inquiries, please visit our Help Center or contact support@smartcse.edu.`,
  },
];

const keyPoints = [
  "You must be 18+ and affiliated with a participating institution",
  "Keep your account credentials secure and confidential",
  "Academic integrity violations are strictly prohibited",
  "We respect your intellectual property rights",
  "Your data is protected according to our Privacy Policy",
  "We may terminate accounts for violations",
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Please read these terms carefully before using SmartCSE
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Effective Date: January 25, 2026 | Last Updated: January 25, 2026
            </p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Key Points Summary */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Key Points Summary
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-card transition-colors group"
                >
                  <section.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-foreground group-hover:text-primary transition-colors text-sm">
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
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
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

      {/* Agreement Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Agreement to Terms
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              By creating an account or using SmartCSE, you acknowledge that you
              have read, understood, and agree to be bound by these Terms of
              Service and our Privacy Policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">I Understand and Agree</Button>
              <Button variant="outline" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Contact Legal Team
              </Button>
            </div>
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
                href="/privacy-policy"
                className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors text-foreground"
              >
                Privacy Policy
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
