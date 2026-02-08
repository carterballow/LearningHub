"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Edit3,
  LogOut,
  BookOpen,
  Clock,
  Globe,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const API_BASE = "http://localhost:4000"

// ---------------- HARD CODED ACADEMIC INFO (unchanged) ----------------
const academicInfo = {
  gpa: "3.72",
  credits: 68,
  totalCredits: 120,
  major: "Computer Science",
  minor: "Mathematics",
  year: "Junior",
  advisor: "Dr. Margaret Wilson",
  enrollmentDate: "Fall 2023",
}

const achievements = [
  { title: "Dean's List", description: "Fall 2025", type: "academic" },
  { title: "Perfect Attendance", description: "CS 101", type: "attendance" },
  { title: "Top Quiz Score", description: "CHEM 202 - Quiz 3", type: "quiz" },
  { title: "Study Streak", description: "15 day streak", type: "study" },
]

// ---------------- TYPES ----------------
type User = {
  name: string
  email: string
}

type Course = {
  _id: string
  title: string
  code: string
  color?: string
}

// helper to generate initials from course code
function getInitials(code: string) {
  return code
    .split(" ")
    .map((c) => c[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ProfileContent() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        })
        if (!res.ok) return

        const data = await res.json()

        // 🔥 HANDLE BOTH SHAPES
        if (data.name && data.email) {
          setUser(data)
        } else if (data.user) {
          setUser(data.user)
        } else {
          console.error("Unexpected user response:", data)
        }
      } catch (err) {
        console.error("User fetch failed", err)
      }
    }

    fetchUser()
  }, [])

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`, {
          credentials: "include",
        })
        if (!res.ok) return

        const data = await res.json()

        // 🔥 HANDLE BOTH POSSIBLE SHAPES
        if (Array.isArray(data)) {
          setCourses(data)
        } else if (Array.isArray(data.courses)) {
          setCourses(data.courses)
        } else {
          console.error("Unexpected courses response:", data)
          setCourses([])
        }
      } catch (err) {
        console.error("Courses fetch failed", err)
      }
    }

    fetchCourses()
  }, [])


  // logout (optional backend endpoint later)
  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
    window.location.href = "/login"
  }

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PROFILE CARD */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* 🔥 REAL NAME */}
              <h3 className="text-lg font-bold text-foreground">{user?.name ?? "Loading..."}</h3>

              <Badge className="mt-2 bg-primary text-primary-foreground">{academicInfo.year}</Badge>

              <Separator className="my-4 w-full" />

              <div className="flex w-full flex-col gap-3 text-left">
                {/* 🔥 REAL EMAIL */}
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{user?.email ?? "Loading..."}</span>
                </div>

                {/* Rest stays fake */}
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Discord: alexj#1234</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Dorm Hall C, Room 302</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{academicInfo.major}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Enrolled: {academicInfo.enrollmentDate}</span>
                </div>
              </div>

              <Separator className="my-4 w-full" />

              <Link href="/settings" className="w-full">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Shield className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ACADEMIC INFO — UNCHANGED */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Academic Information</CardTitle>
            <CardDescription>Your academic progress and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{academicInfo.gpa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Major</p>
                  <p className="text-sm font-medium text-foreground mt-1">{academicInfo.major}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minor</p>
                  <p className="text-sm font-medium text-foreground mt-1">{academicInfo.minor}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Credit Progress</span>
                    <span className="font-medium text-foreground">
                      {academicInfo.credits}/{academicInfo.totalCredits}
                    </span>
                  </div>
                  <Progress value={(academicInfo.credits / academicInfo.totalCredits) * 100} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔥 REAL ENROLLED COURSES */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Enrolled Courses</CardTitle>
          <CardDescription>Your current courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-secondary/50"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary text-card text-xs font-bold">
                    {getInitials(course.code)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{course.code}</p>
                  <p className="text-xs text-muted-foreground truncate">{course.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
