import { DashboardLayout } from "@/components/dashboard-layout"
import { HomeContent } from "@/components/home-content"

export default function Page() {
  return (
    <DashboardLayout title="Home">
      <HomeContent />
    </DashboardLayout>
  )
}
