import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"
import logo from "@/public/cse.avif"
import Image from "next/image"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { href: "/features", label: "Features" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  modules: {
    title: "Modules",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/schedule", label: "Schedule" },
      { href: "/attendance", label: "Attendance" },
      { href: "/resources", label: "Resources" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { href: "/help-center", label: "Help Center" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/give-feedback", label: "Give Feedback" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">SmartCSE</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A comprehensive platform for managing academic and administrative tasks 
              within the CSE department at University of Barishal.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>University of Barishal, Barishal, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@smartcse.edu.bd</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SmartCSE. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </footer>
  )
}
