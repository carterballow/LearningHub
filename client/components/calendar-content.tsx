"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Clock, FileText, HelpCircle, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const API = "http://localhost:4000"
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

// Maps course schedule strings to days of week (0=Sun … 6=Sat)
const SCHEDULE_DAYS: Record<string, number[]> = {
  MWF: [1, 3, 5],
  TuTh: [2, 4],
  MW: [1, 3],
  TTh: [2, 4],
}

type ApiAssignment = {
  id: string
  title: string
  type: string
  dueDate: string
  course: { code: string; title: string; color?: string }
  status: string
}

type CalEvent = {
  id: string
  title: string
  course: string
  type: "assignment" | "exam" | "quiz" | "class"
  time: string
  location?: string
  color: string
}

function typeColor(type: string) {
  if (type === "exam" || type === "quiz") return "bg-red-500"
  if (type === "class") return "bg-green-500"
  return "bg-yellow-500"
}

function typeBadge(type: string) {
  if (type === "exam") return <Badge className="bg-red-100 text-red-700 text-[10px]">Exam</Badge>
  if (type === "quiz") return <Badge className="bg-red-100 text-red-700 text-[10px]">Quiz</Badge>
  if (type === "class") return <Badge className="bg-green-100 text-green-700 text-[10px]">Class</Badge>
  if (type === "assignment" || type === "homework") return <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Assignment</Badge>
  if (type === "project") return <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Project</Badge>
  if (type === "reading") return <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Reading</Badge>
  return <Badge variant="secondary" className="text-[10px]">{type}</Badge>
}

function typeIcon(type: string) {
  if (type === "quiz" || type === "exam") return <HelpCircle className="h-3.5 w-3.5" />
  if (type === "class") return <BookOpen className="h-3.5 w-3.5" />
  return <FileText className="h-3.5 w-3.5" />
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function parseScheduleDays(schedule: string): number[] {
  for (const [key, days] of Object.entries(SCHEDULE_DAYS)) {
    if (schedule.includes(key)) return days
  }
  return []
}

function parseScheduleTime(schedule: string): string {
  const match = schedule.match(/(\d+:\d+(?:\s*[AP]M)?)/i)
  return match ? match[1] : "TBD"
}

export function CalendarContent() {
  const router = useRouter()
  const today = new Date()
  const todayKey = toDateKey(today)

  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [eventMap, setEventMap] = useState<Record<string, CalEvent[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [assignRes, courseRes] = await Promise.all([
          fetch(`${API}/api/assignments`, { credentials: "include" }),
          fetch(`${API}/api/courses`, { credentials: "include" }),
        ])
        if (assignRes.status === 401) { router.push("/login"); return }

        const assignData = await assignRes.json()
        const courseData = await courseRes.json()

        const map: Record<string, CalEvent[]> = {}

        const addEvent = (key: string, ev: CalEvent) => {
          if (!map[key]) map[key] = []
          map[key].push(ev)
        }

        // Add assignments as due-date events (only within 14 days past)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 14)
        for (const a of (assignData.assignments || [])) {
          if (!a.dueDate) continue
          if (new Date(a.dueDate) < cutoff) continue
          const evType = a.type === "exam" ? "exam" : a.type === "quiz" ? "quiz" : "assignment"
          const key = toDateKey(new Date(a.dueDate))
          addEvent(key, {
            id: a.id,
            title: a.title,
            course: a.course.code,
            type: evType,
            time: "11:59 PM",
            color: typeColor(evType),
          })
        }

        // Add recurring class sessions for each course this month and next
        for (const course of (courseData.courses || [])) {
          if (!course.schedule) continue
          const classDays = parseScheduleDays(course.schedule)
          const classTime = parseScheduleTime(course.schedule)
          const locationMatch = course.schedule.match(/·\s*(.+)$/)
          const location = locationMatch ? locationMatch[1].trim() : undefined

          // Generate class events for 3 months out
          for (let monthOffset = -1; monthOffset <= 2; monthOffset++) {
            const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
            const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(d.getFullYear(), d.getMonth(), day)
              if (classDays.includes(date.getDay())) {
                const key = toDateKey(date)
                addEvent(key, {
                  id: `class-${course.code}-${key}`,
                  title: `${course.code} Class`,
                  course: course.code,
                  type: "class",
                  time: classTime,
                  location,
                  color: "bg-green-500",
                })
              }
            }
          }
        }

        setEventMap(map)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }
  const goToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(todayKey)
  }

  const formatKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${currentYear}-${m}-${d}`
  }

  const selectedEvents = eventMap[selectedDate] || []
  const upcomingDeadlines = Object.entries(eventMap)
    .flatMap(([date, evs]) => evs.filter(e => e.type !== "class").map(e => ({ ...e, date })))
    .filter(e => e.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">Classes, assignments, and deadlines</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">{months[currentMonth]} {currentYear}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" onClick={goToday}>Today</Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading calendar…</p>
            ) : (
              <div className="grid grid-cols-7 gap-px">
                {daysOfWeek.map(d => (
                  <div key={d} className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="h-16" />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const key = formatKey(day)
                  const dayEvs = eventMap[key] || []
                  const isToday = key === todayKey
                  const isSelected = key === selectedDate
                  return (
                    <button key={day} onClick={() => setSelectedDate(key)}
                      className={`flex h-16 flex-col items-start rounded-lg p-1 text-left transition-colors hover:bg-secondary/50 ${isSelected ? "bg-primary/5 ring-1 ring-primary" : ""}`}>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                        {day}
                      </span>
                      <div className="mt-0.5 flex flex-wrap gap-0.5">
                        {dayEvs.slice(0, 3).map((ev, idx) => (
                          <div key={idx} className={`h-1.5 w-1.5 rounded-full ${ev.color}`} />
                        ))}
                        {dayEvs.length > 3 && <span className="text-[9px] text-muted-foreground">+{dayEvs.length - 3}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </CardTitle>
              <CardDescription>{selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nothing scheduled</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedEvents.map((ev, i) => (
                    <div key={i} className={`rounded-lg border-l-2 bg-card p-3 ${ev.type === "exam" || ev.type === "quiz" ? "border-l-red-500" : ev.type === "class" ? "border-l-green-500" : "border-l-yellow-500"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {typeIcon(ev.type)}
                          <span className="text-sm font-medium text-foreground">{ev.title}</span>
                        </div>
                        {typeBadge(ev.type)}
                      </div>
                      <div className="mt-1.5 flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</div>
                        {ev.location && <div className="text-xs text-muted-foreground">{ev.location}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {upcomingDeadlines.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/50 transition-colors">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${d.type === "exam" || d.type === "quiz" ? "bg-red-100" : "bg-yellow-100"}`}>
                        {typeIcon(d.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{d.title}</p>
                        <p className="text-[11px] text-muted-foreground">{d.course} · {new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
