import { DashboardLayout } from "@/components/dashboard-layout"
import { QuizzesContent } from "@/components/courses/quizzes-content"

export default function QuizzesPage() {
  return (
    <DashboardLayout title="Quizzes">
      <QuizzesContent />
    </DashboardLayout>
  )
}
