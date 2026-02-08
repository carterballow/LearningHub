"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  BookOpen,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type CalendarEvent = {
  id: number
  title: string
  course: string
  type: "assignment" | "quiz" | "class" | "study"
  time: string
  location?: string
  color: string
}

const events: Record<string, CalendarEvent[]> = {
  "2026-02-07": [
    { id: 1, title: "CS 101 Lecture", course: "CS 101", type: "class", time: "9:00 AM", location: "Hall B-204", color: "bg-primary" },
    { id: 2, title: "MATH 201 Recitation", course: "MATH 201", type: "class", time: "11:00 AM", location: "Room A-112", color: "bg-chart-3" },
    { id: 3, title: "CHEM 202 Lab", course: "CHEM 202", type: "class", time: "2:00 PM", location: "Science Center 301", color: "bg-destructive" },
    { id: 4, title: "Study Group - CS 210", course: "CS 210", type: "study", time: "4:30 PM", location: "Library Room 5", color: "bg-primary" },
  ],
  "2026-02-08": [
    { id: 5, title: "Linear Algebra Problem Set 5", course: "MATH 201", type: "assignment", time: "11:59 PM", color: "bg-chart-3" },
  ],
  "2026-02-09": [
    { id: 6, title: "CS 101 Lecture", course: "CS 101", type: "class", time: "9:00 AM", location: "Hall B-204", color: "bg-primary" },
    { id: 7, title: "ENG 301 Seminar", course: "ENG 301", type: "class", time: "1:00 PM", location: "Humanities 105", color: "bg-accent" },
  ],
  "2026-02-10": [
    { id: 8, title: "Research Paper Draft Due", course: "ENG 301", type: "assignment", time: "11:59 PM", color: "bg-accent" },
    { id: 9, title: "MATH 201 Lecture", course: "MATH 201", type: "class", time: "11:00 AM", location: "Room A-112", color: "bg-chart-3" },
  ],
  "2026-02-11": [
    { id: 10, title: "Midterm Quiz - Organic Chemistry", course: "CHEM 202", type: "quiz", time: "2:00 PM", location: "Science Center 301", color: "bg-destructive" },
    { id: 11, title: "CS 101 Lecture", course: "CS 101", type: "class", time: "9:00 AM", location: "Hall B-204", color: "bg-primary" },
  ],
  "2026-02-12": [
    { id: 12, title: "Data Structures Lab Report", course: "CS 210", type: "assignment", time: "11:59 PM", color: "bg-primary" },
    { id: 13, title: "ENG 301 Seminar", course: "ENG 301", type: "class", time: "1:00 PM", location: "Humanities 105", color: "bg-accent" },
  ],
  "2026-02-13": [
    { id: 14, title: "Pop Quiz - Binary Trees", course: "CS 210", type: "quiz", time: "4:00 PM", location: "CS Building 201", color: "bg-primary" },
    { id: 15, title: "HIST 150 Lecture", course: "HIST 150", type: "class", time: "10:00 AM", location: "History Hall 300", color: "bg-chart-3" },
  ],
  "2026-02-14": [
    { id: 16, title: "History Essay Outline Due", course: "HIST 150", type: "assignment", time: "11:59 PM", color: "bg-chart-3" },
  ],
  "2026-02-15": [
    { id: 17, title: "Programming Assignment 3", course: "CS 101", type: "assignment", time: "11:59 PM", color: "bg-primary" },
  ],
  "2026-02-16": [
    { id: 18, title: "Chapter 7 Quiz - Linear Algebra", course: "MATH 201", type: "quiz", time: "11:00 AM", location: "Room A-112", color: "bg-chart-3" },
  ],
}

function getTypeIcon(type: string) {
  switch (type) {
    case "assignment":
      return <FileText className="h-3.5 w-3.5" />
    case "quiz":
      return <HelpCircle className="h-3.5 w-3.5" />
    case "class":
      return <BookOpen className="h-3.5 w-3.5" />
    case "study":
      return <BookOpen className="h-3.5 w-3.5" />
    default:
      return <Clock className="h-3.5 w-3.5" />
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "assignment":
      return <Badge className="bg-accent text-accent-foreground text-[10px]">Assignment</Badge>
    case "quiz":
      return <Badge className="bg-destructive text-destructive-foreground text-[10px]">Quiz</Badge>
    case "class":
      return <Badge variant="secondary" className="text-[10px]">Class</Badge>
    case "study":
      return <Badge className="bg-primary text-primary-foreground text-[10px]">Study</Badge>
    default:
      return null
  }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function CalendarContent() {
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(1) // February (0-indexed)
  const [selectedDate, setSelectedDate] = useState("2026-02-07")

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const formatDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${currentYear}-${m}-${d}`
  }

  const selectedEvents = events[selectedDate] || []

  const upcomingDeadlines = Object.entries(events)
    .flatMap(([date, evts]) =>
      evts
        .filter((e) => e.type === "assignment" || e.type === "quiz")
        .map((e) => ({ ...e, date }))
    )
    .filter((e) => e.date >= "2026-02-07")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">
          View your classes, assignments, and deadlines
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">
                {months[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous month</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setCurrentYear(2026)
                    setCurrentMonth(1)
                    setSelectedDate("2026-02-07")
                  }}
                >
                  Today
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next month</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateKey = formatDateKey(day)
                const dayEvents = events[dateKey] || []
                const isToday = dateKey === "2026-02-07"
                const isSelected = dateKey === selectedDate

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(dateKey)}
                    className={`flex h-20 flex-col items-start rounded-lg p-1.5 text-left transition-colors hover:bg-secondary/50 ${
                      isSelected ? "bg-primary/5 ring-1 ring-primary" : ""
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-0.5 flex flex-wrap gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`h-1.5 w-1.5 rounded-full ${event.color}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded-lg border-l-2 bg-card p-3 ${
                        event.type === "assignment"
                          ? "border-l-accent"
                          : event.type === "quiz"
                            ? "border-l-destructive"
                            : "border-l-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(event.type)}
                          <span className="text-sm font-medium text-foreground">
                            {event.title}
                          </span>
                        </div>
                        {getTypeBadge(event.type)}
                      </div>
                      <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events on this day
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2.5">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      deadline.type === "quiz" ? "bg-destructive/10" : "bg-accent/10"
                    }`}>
                      {deadline.type === "quiz" ? (
                        <HelpCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <FileText className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {deadline.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {deadline.course} - {new Date(deadline.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
