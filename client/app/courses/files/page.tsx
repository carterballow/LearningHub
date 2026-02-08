import { DashboardLayout } from "@/components/dashboard-layout"
import { FilesContent } from "@/components/courses/files-content"

export default function FilesPage() {
  return (
    <DashboardLayout title="Files">
      <FilesContent />
    </DashboardLayout>
  )
}
