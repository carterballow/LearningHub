import { DashboardLayout } from "@/components/dashboard-layout"
import { AssignmentsContent } from "@/components/courses/assignments-content"

export default function AssignmentsPage() {
  return (
    <DashboardLayout title="Assignments">
      <AssignmentsContent />
    </DashboardLayout>
  )
}
