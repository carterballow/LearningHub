"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const API = "http://localhost:4000"

type ApiCourse = {
  _id: string
  code: string
  title: string
  color?: string
  schedule?: string
}

type ApiAssignment = {
  id: string
  status: "todo" | "in-progress" | "done"
  course: { id: string; code: string; title: string; color?: string }
  title: string
  type: "homework" | "quiz" | "project" | "reading" | "exam"
  dueDate: string
}

type Announcement = {
  title: string
  description: string
  time: string
  type?: string
}


function letterGrade(pct: number): string {
  if (pct >= 97) return "A+"
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  if (pct >= 70) return "C-"
  if (pct >= 67) return "D+"
  if (pct >= 63) return "D"
  if (pct >= 60) return "D-"
  return "F"
}

function getStatusBadge(status: "urgent" | "upcoming" | "normal") {
  switch (status) {
    case "urgent":
      return <Badge className="bg-destructive text-destructive-foreground text-[10px]">Due Soon</Badge>
    case "upcoming":
      return <Badge className="bg-accent text-accent-foreground text-[10px]">This Week</Badge>
    default:
      return <Badge variant="secondary" className="text-[10px]">Upcoming</Badge>
  }
}

function formatDue(dueDateISO: string) {
  const d = new Date(dueDateISO)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getClassesToday(courses: ApiCourse[]): { name: string; code: string; time: string; location: string }[] {
  const dayOfWeek = new Date().getDay()
  const MWF = [1, 3, 5]
  const TuTh = [2, 4]
  const result: { name: string; code: string; time: string; location: string }[] = []
  for (const c of courses) {
    if (!c.schedule) continue
    const days = c.schedule.includes("MWF")
      ? MWF
      : c.schedule.includes("TuTh") || c.schedule.includes("TTh")
      ? TuTh
      : c.schedule.includes("MW")
      ? [1, 3]
      : []
    if (days.includes(dayOfWeek)) {
      const timeMatch = c.schedule.match(/(\d+:\d+(?:\s*[–-]\s*\d+:\d+)?\s*[AP]M)/i)
      const locMatch = c.schedule.match(/·\s*(.+)$/)
      result.push({
        name: c.title,
        code: c.code,
        time: timeMatch?.[1] || "TBD",
        location: locMatch?.[1]?.trim() || "TBD",
      })
    }
  }
  return result
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

export function HomeContent() {
  const router = useRouter()

  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState<"student" | "teacher">("student")
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [assignments, setAssignments] = useState<ApiAssignment[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [overallGrade, setOverallGrade] = useState<number | null | undefined>(undefined)
  const [courseGrades, setCourseGrades] = useState<Record<string, number>>({})
  const [students, setStudents] = useState<{ id: string; name: string; email: string; avatarUrl: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const opts: RequestInit = { credentials: "include", headers: { "Content-Type": "application/json" } }

        const [meRes, coursesRes, assignmentsRes, announcementsRes, gradesSummaryRes] = await Promise.all([
          fetch(`${API}/api/auth/me`, opts),
          fetch(`${API}/api/courses`, opts),
          fetch(`${API}/api/assignments`, opts),
          fetch(`${API}/api/announcements`, opts),
          fetch(`${API}/api/grades/summary`, opts),
        ])

        if (meRes.status === 401) {
          router.push("/login")
          return
        }

        const meData = await meRes.json().catch(() => ({}))
        const coursesData = await coursesRes.json().catch(() => ({}))
        const assignmentsData = await assignmentsRes.json().catch(() => ({}))
        const announcementsData = await announcementsRes.json().catch(() => ({}))
        const gradesSummaryData = await gradesSummaryRes.json().catch(() => ({}))

        // Fetch students if teacher
        if (meData?.user?.role === "teacher") {
          fetch(`${API}/api/students`, opts)
            .then((r) => r.json())
            .then((d) => { if (!cancelled) setStudents(d.students || []) })
            .catch(() => {})
        }

        if (cancelled) return

        setUserName(meData?.user?.name || "")
        setUserRole(meData?.user?.role === "teacher" ? "teacher" : "student")
        setCourses(coursesData?.courses || [])
        setAssignments(assignmentsData?.assignments || [])

        const fetchedAnnouncements: Announcement[] = announcementsData?.announcements || []
        setAnnouncements(fetchedAnnouncements)

        const overall = gradesSummaryData?.overall
        setOverallGrade(typeof overall === "number" ? overall : null)

        const gradeMap: Record<string, number> = {}
        for (const c of (gradesSummaryData?.courses || [])) {
          if (c.avg != null) gradeMap[c.code] = Math.round(c.avg)
        }
        setCourseGrades(gradeMap)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router])

  const now = new Date()

  const pendingCount = useMemo(() => {
    return assignments.filter((a) => a.status !== "done" && new Date(a.dueDate) > now).length
  }, [assignments])

  const quizCount = useMemo(() => {
    return assignments.filter(
      (a) => (a.type === "quiz" || a.type === "exam") && a.status !== "done" && new Date(a.dueDate) > now
    ).length
  }, [assignments])

  const avgGradeDisplay = overallGrade === undefined
    ? "..."
    : overallGrade === null
    ? "N/A"
    : letterGrade(overallGrade)

  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status !== "done" && new Date(a.dueDate) > now)
      .slice()
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((a) => {
        const due = new Date(a.dueDate)
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        const status: "urgent" | "upcoming" | "normal" =
          diffDays <= 2 ? "urgent" : diffDays <= 7 ? "upcoming" : "normal"
        return {
          title: a.title,
          course: a.course.code,
          due: formatDue(a.dueDate),
          status,
          type: a.type === "quiz" || a.type === "exam" ? "Quiz" : "Assignment",
        }
      })
  }, [assignments])

  const colors = ["bg-primary", "bg-chart-3", "bg-destructive", "bg-accent"]
  const recentCourses = useMemo(() => {
    return courses.slice(0, 4).map((c, i) => {
      const initials = (c.code || c.title || "C").slice(0, 2).toUpperCase()
      return {
        name: c.title,
        code: c.code,
        progress: courseGrades[c.code] ?? null,
        initials,
        color: colors[i % colors.length],
      }
    })
  }, [courses, courseGrades])

  const classesToday = useMemo(() => getClassesToday(courses), [courses])

  const stats = [
    {
      title: "Active Courses",
      value: String(courses.length || 0),
      description: "currently enrolled",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/courses",
    },
    {
      title: "Pending Assignments",
      value: String(pendingCount),
      description: "not yet completed",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/calendar",
    },
    {
      title: "Upcoming Quizzes",
      value: String(quizCount),
      description: "quizzes and exams",
      icon: HelpCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      href: "/calendar",
    },
    {
      title: "Avg. Grade",
      value: loading ? "..." : avgGradeDisplay,
      description: "overall performance",
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      href: "/profile",
    },
  ]

  // ── Teacher dashboard ──────────────────────────────────────────────────────
  if (!loading && userRole === "teacher") {
    const classesToday = getClassesToday(courses)
    const colors = ["bg-primary", "bg-chart-3", "bg-destructive", "bg-accent"]

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground text-balance">
            {`Welcome back${userName ? `, ${userName}` : ""}`}
          </h2>
          <p className="text-muted-foreground mt-1">{"Here's an overview of your courses."}</p>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/courses" className="block">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Courses Teaching</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{courses.length}</p>
                    <p className="mt-1 text-xs text-muted-foreground">active this term</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar" className="block">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Classes Today</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{classesToday.length}</p>
                    <p className="mt-1 text-xs text-muted-foreground">on your schedule</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
                    <Calendar className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-none shadow-sm h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{students.length || "—"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">across all courses</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses grid */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Your Courses</CardTitle>
                <CardDescription>Click a course to manage it</CardDescription>
              </div>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                All Courses
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c, i) => (
                  <Link key={c._id} href={`/courses/${c._id}`} className="block">
                    <div className="rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className={`${colors[i % colors.length]} text-card text-xs font-bold`}>
                            {c.code.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{c.code}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                        </div>
                      </div>
                      {c.schedule && (
                        <p className="mt-2 text-xs text-muted-foreground truncate">{c.schedule}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's schedule */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">{"Today's Schedule"}</CardTitle>
                <CardDescription>{todayLabel()}</CardDescription>
              </div>
              <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">
                Full Calendar
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {classesToday.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {classesToday.slice(0, 4).map((event, idx) => (
                  <div
                    key={`${event.code}-${idx}`}
                    className="rounded-lg border border-border bg-card p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">{event.time}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">{event.code}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{event.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{event.location}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Students */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground">All Students</CardTitle>
            <CardDescription>{students.length} student{students.length !== 1 ? "s" : ""} enrolled across your courses</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      {s.avatarUrl ? <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{s.name.slice(0, 2).toUpperCase()}</AvatarFallback> : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{s.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Student dashboard ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">
          {loading ? "Welcome back" : `Welcome back${userName ? `, ${userName}` : ""}`}
        </h2>
        <p className="text-muted-foreground mt-1">{"Here's what's happening with your courses today."}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-none shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Upcoming Assignments</CardTitle>
                <CardDescription>Your next deadlines at a glance</CardDescription>
              </div>
              <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">
                View Calendar
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : upcomingAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingAssignments.map((a) => (
                  <div
                    key={`${a.course}-${a.title}-${a.due}`}
                    className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        a.type === "Quiz" ? "bg-destructive/10" : "bg-primary/10"
                      }`}
                    >
                      {a.type === "Quiz" ? (
                        <HelpCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.course}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(a.status)}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{a.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Course Progress</CardTitle>
                <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                  All Courses
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : recentCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentCourses.map((course) => (
                    <div key={course.code} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className={`${course.color} text-card text-xs font-bold`}>
                          {course.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">{course.code}</p>
                          <span className="text-xs text-muted-foreground">
                            {course.progress != null ? `${course.progress}%` : "No grades yet"}
                          </span>
                        </div>
                        <Progress value={course.progress ?? 0} className="mt-1.5 h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No announcements yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {announcements.map((announcement, idx) => (
                    <div key={`${announcement.title}-${idx}`} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{announcement.description}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/60">{announcement.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">{"Today's Schedule"}</CardTitle>
              <CardDescription>{todayLabel()}</CardDescription>
            </div>
            <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">
              Full Calendar
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : classesToday.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {classesToday.slice(0, 4).map((event, idx) => (
                <div
                  key={`${event.code}-${idx}`}
                  className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{event.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">{event.code}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{event.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
