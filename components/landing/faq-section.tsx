"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FadeIn } from "@/components/ui/motion"

const faqs = [
  {
    question: "Who can use SmartCSE?",
    answer: "SmartCSE is designed for students, teachers, and administrators of the CSE department. Each user type has access to features specific to their role.",
  },
  {
    question: "How do I sign up for SmartCSE?",
    answer: "You can sign up using your university email and credentials. Simply click on 'Get Started' and follow the registration process. Your account will be verified by the department admin.",
  },
  {
    question: "Is SmartCSE free to use?",
    answer: "Yes, SmartCSE is completely free for all students, teachers, and staff of the CSE department at University of Barishal.",
  },
  {
    question: "Can I access SmartCSE on my mobile phone?",
    answer: "Absolutely! SmartCSE is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.",
  },
  {
    question: "How is my data protected?",
    answer: "We implement enterprise-grade security measures including encrypted data transmission, secure authentication, and role-based access control to protect your academic data.",
  },
  {
    question: "How do I mark attendance?",
    answer: "Teachers can mark attendance in real-time during class using the Attendance module. Students can view their attendance records anytime through their dashboard.",
  },
  {
    question: "Can I download course materials?",
    answer: "Yes, all shared resources including lecture notes, books, and other materials can be downloaded from the Resource Library module.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team through the Contact page or by emailing support@smartcse.edu.bd. We typically respond within 24 hours.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about SmartCSE.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border/50 bg-card mb-3 rounded-lg px-6 transition-all hover:shadow-md"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
