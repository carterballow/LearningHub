import { DashboardLayout } from "@/components/dashboard-layout"
import { NotesContent } from "@/components/courses/notes-content"

export default function NotesPage() {
  return (
    <DashboardLayout title="Notes">
      <NotesContent />
    </DashboardLayout>
  )
}
