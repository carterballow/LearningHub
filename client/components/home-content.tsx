"use client"

import {
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const stats = [
  {
    title: "Active Courses",
    value: "6",
    description: "2 ending this month",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Pending Assignments",
    value: "4",
    description: "2 due this week",
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Upcoming Quizzes",
    value: "3",
    description: "Next: Tomorrow",
    icon: HelpCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Avg. Grade",
    value: "A-",
    description: "+2% from last term",
    icon: TrendingUp,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

const upcomingAssignments = [
  {
    title: "Linear Algebra Problem Set 5",
    course: "MATH 201",
    due: "Feb 8, 2026",
    status: "urgent",
    type: "Assignment",
  },
  {
    title: "Research Paper Draft",
    course: "ENG 301",
    due: "Feb 10, 2026",
    status: "upcoming",
    type: "Assignment",
  },
  {
    title: "Midterm Quiz - Organic Chemistry",
    course: "CHEM 202",
    due: "Feb 11, 2026",
    status: "upcoming",
    type: "Quiz",
  },
  {
    title: "Data Structures Lab Report",
    course: "CS 210",
    due: "Feb 12, 2026",
    status: "normal",
    type: "Assignment",
  },
  {
    title: "History Essay Outline",
    course: "HIST 150",
    due: "Feb 14, 2026",
    status: "normal",
    type: "Assignment",
  },
]

const recentCourses = [
  {
    name: "Introduction to Computer Science",
    code: "CS 101",
    instructor: "Prof. Williams",
    progress: 72,
    initials: "CS",
    color: "bg-primary",
  },
  {
    name: "Linear Algebra",
    code: "MATH 201",
    instructor: "Dr. Chen",
    progress: 65,
    initials: "MA",
    color: "bg-chart-3",
  },
  {
    name: "Organic Chemistry",
    code: "CHEM 202",
    instructor: "Prof. Patel",
    progress: 58,
    initials: "CH",
    color: "bg-destructive",
  },
  {
    name: "English Composition",
    code: "ENG 301",
    instructor: "Dr. Smith",
    progress: 80,
    initials: "EN",
    color: "bg-accent",
  },
]

const announcements = [
  {
    title: "Campus Library Extended Hours",
    description: "Library will be open until midnight during midterm week (Feb 10-14).",
    time: "2 hours ago",
  },
  {
    title: "CS 101 Office Hours Change",
    description: "Prof. Williams moved office hours to Thursday 3-5pm this week only.",
    time: "5 hours ago",
  },
  {
    title: "Spring Break Schedule",
    description: "Spring break begins March 16. No classes will be held March 16-20.",
    time: "1 day ago",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "urgent":
      return (
        <Badge className="bg-destructive text-destructive-foreground text-[10px]">
          Due Soon
        </Badge>
      )
    case "upcoming":
      return (
        <Badge className="bg-accent text-accent-foreground text-[10px]">
          This Week
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-[10px]">
          Upcoming
        </Badge>
      )
  }
}

export function HomeContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, Alex
        </h2>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening with your courses today."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
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
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Upcoming Assignments */}
        <Card className="border-none shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Upcoming Assignments</CardTitle>
                <CardDescription>Your next deadlines at a glance</CardDescription>
              </div>
              <Link
                href="/calendar"
                className="text-sm font-medium text-primary hover:underline"
              >
                View Calendar
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.title}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${assignment.type === "Quiz" ? "bg-destructive/10" : "bg-primary/10"}`}>
                    {assignment.type === "Quiz" ? (
                      <HelpCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.course}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {getStatusBadge(assignment.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{assignment.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Course Progress */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Course Progress</CardTitle>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  All Courses
                </Link>
              </div>
            </CardHeader>
            <CardContent>
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
                        <p className="text-sm font-medium text-foreground truncate">
                          {course.code}
                        </p>
                        <span className="text-xs text-muted-foreground">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="mt-1.5 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {announcements.map((announcement) => (
                  <div key={announcement.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {announcement.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {announcement.description}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        {announcement.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Schedule */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">{"Today's Schedule"}</CardTitle>
              <CardDescription>Saturday, February 7, 2026</CardDescription>
            </div>
            <Link
              href="/calendar"
              className="text-sm font-medium text-primary hover:underline"
            >
              Full Calendar
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { time: "9:00 AM", title: "CS 101 Lecture", location: "Hall B-204", status: "done" },
              { time: "11:00 AM", title: "MATH 201 Recitation", location: "Room A-112", status: "done" },
              { time: "2:00 PM", title: "CHEM 202 Lab", location: "Science Center 301", status: "current" },
              { time: "4:30 PM", title: "Study Group - CS 210", location: "Library Room 5", status: "upcoming" },
            ].map((event) => (
              <div
                key={event.time}
                className={`rounded-lg border p-3 transition-colors ${
                  event.status === "current"
                    ? "border-primary bg-primary/5"
                    : event.status === "done"
                      ? "border-border bg-muted/50"
                      : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  {event.status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : event.status === "current" ? (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground">{event.time}</span>
                </div>
                <p className={`mt-2 text-sm font-medium ${event.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {event.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{event.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
