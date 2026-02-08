import { DashboardLayout } from "@/components/dashboard-layout"
import { CalendarContent } from "@/components/calendar-content"

export default function CalendarPage() {
  return (
    <DashboardLayout title="Calendar">
      <CalendarContent />
    </DashboardLayout>
  )
}
