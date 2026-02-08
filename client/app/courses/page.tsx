import { DashboardLayout } from "@/components/dashboard-layout"
import { CourseDashboard } from "@/components/course-dashboard"

export default function CoursesPage() {
  return (
    <DashboardLayout title="Courses">
      <CourseDashboard />
    </DashboardLayout>
  )
}
