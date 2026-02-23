// app/teacher/layout.tsx
import React from "react"

// import { DashboardHeader } from "@/components/dashboard/header"
import { TeacherSidebar } from "@/components/TeacherSiddebar"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex min-h-screen bg-background">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col lg:pl-72">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}