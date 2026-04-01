"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Home, User, LayoutDashboard, Calendar, GraduationCap } from "lucide-react"

const ROOT_NAV = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/courses", icon: LayoutDashboard, label: "Courses" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
]

const COURSE_TABS = [
  { tab: "overview", label: "Overview" },
  { tab: "assignments", label: "Assignments" },
  { tab: "grades", label: "Grades" },
  { tab: "resources", label: "Resources" },
]

export function CoursePageLayout({
  courseId,
  children,
}: {
  courseId: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") ?? "overview"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Collapsed root sidebar — icons only */}
      <nav className="flex w-14 flex-shrink-0 flex-col items-center gap-1 border-r bg-sidebar py-3">
        <Link
          href="/home"
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-primary-foreground"
          title="Learning Hub"
        >
          <GraduationCap className="h-5 w-5" />
        </Link>
        {ROOT_NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              href === "/courses"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </Link>
        ))}
      </nav>

      {/* Secondary course nav — text only, no background */}
      <nav className="flex w-44 flex-shrink-0 flex-col border-r px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Course
        </p>
        {COURSE_TABS.map(({ tab, label }) => (
          <Link
            key={tab}
            href={`/courses/${courseId}?tab=${tab}`}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTab === tab
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
