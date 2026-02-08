import { DashboardLayout } from "@/components/dashboard-layout"
import { CoursePageContent } from "@/components/course-page-content"

export default function CoursePage({ params }: { params: { courseId: string } }) {
  return (
    <DashboardLayout title="Course">
      <CoursePageContent courseId={params.courseId} />
    </DashboardLayout>
  )
}
