"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, CheckCircle2, Clock, GraduationCap, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type Exam = {
  title: string
  courseCode: string
  courseTitle: string
  dueDate: string
  daysUntil: number
  maxScore: number
}

type PlanStep = {
  day: string
  focus: string
  tasks: string[]
}

type ExamPlan = {
  exam: Exam
  plan: PlanStep[]
}

type Assignment = {
  userAssignmentId: string
  courseCode: string
  title: string
  type: string
  dueDate: string
  daysUntil: number
  status: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function urgencyColor(days: number) {
  if (days <= 3) return "bg-red-100 text-red-700"
  if (days <= 7) return "bg-orange-100 text-orange-700"
  if (days <= 14) return "bg-yellow-100 text-yellow-700"
  return "bg-green-100 text-green-700"
}

function StudyPlanContent() {
  const router = useRouter()
  const [data, setData] = useState<{ exams: Exam[]; studyTimeline: ExamPlan[]; regularAssignments: Assignment[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/study/plan`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null }
        return r.json()
      })
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const noExams = !data?.exams?.length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/study" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Study Hub
        </Link>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Study Plan
        </h2>
      </div>

      {/* Exam countdown cards */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Upcoming Exams</h3>
        {noExams ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">No upcoming exams!</p>
              <p className="text-xs text-muted-foreground mt-1">Enjoy the break — or get ahead on assignments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data!.exams.map((exam, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`text-xs ${urgencyColor(exam.daysUntil)}`}>
                      {exam.daysUntil === 0 ? "TODAY" : exam.daysUntil === 1 ? "TOMORROW" : `${exam.daysUntil} days`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{exam.courseCode}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{exam.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(exam.dueDate)}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <GraduationCap className="h-3 w-3" />
                    <span>{exam.maxScore} points</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Study timelines per exam */}
      {data?.studyTimeline.map((ep, i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-foreground">
                Study Plan: {ep.exam.courseCode} {ep.exam.title}
              </CardTitle>
              <Badge className={urgencyColor(ep.exam.daysUntil)}>
                {ep.exam.daysUntil <= 0 ? "TODAY" : `${ep.exam.daysUntil} days away`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {ep.plan.map((step, j) => (
                <div key={j} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full shrink-0 mt-1 ${j === 0 ? "bg-primary" : "bg-secondary-foreground/20"}`} />
                    {j < ep.plan.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{step.day}</span>
                      <span className="text-xs text-muted-foreground">— {step.focus}</span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {step.tasks.map((task, k) => (
                        <li key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary/50 shrink-0 mt-0.5" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />

      {/* Other upcoming assignments */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Other Upcoming Assignments
        </h3>
        {(!data?.regularAssignments?.length) ? (
          <p className="text-sm text-muted-foreground">No other assignments due.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data!.regularAssignments.map((a, i) => (
              <div key={i} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                  a.type === "quiz" ? "bg-orange-100 text-orange-700" :
                  a.type === "project" ? "bg-purple-100 text-purple-700" :
                  a.type === "reading" ? "bg-green-100 text-green-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {a.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.courseCode}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className={urgencyColor(a.daysUntil).replace("bg-", "text-").split(" ")[0]}>
                    {a.daysUntil === 0 ? "today" : a.daysUntil === 1 ? "tomorrow" : `${a.daysUntil}d`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link to AI tutor */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Need help with any of these?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ask the AI tutor questions about your assignments and exams.</p>
          </div>
          <Link href="/study/ai">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Open AI Tutor
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StudyPlanPage() {
  return (
    <DashboardLayout title="Study Plan">
      <StudyPlanContent />
    </DashboardLayout>
  )
}
