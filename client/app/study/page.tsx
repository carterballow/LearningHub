"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudyContent } from "@/components/study-content"

function StudyPageInner() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId") || undefined
  return <StudyContent courseId={courseId} />
}

export default function StudyPage() {
  return (
    <DashboardLayout title="Study">
      <Suspense fallback={null}>
        <StudyPageInner />
      </Suspense>
    </DashboardLayout>
  )
}
