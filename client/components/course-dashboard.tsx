"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type Course = {
  _id: string
  title: string
  code: string
  term?: string
  color?: string
  instructor?: string
  schedule?: string
}

function getInitials(code: string) {
  return code
    .split(" ")
    .map((c) => c[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function CourseDashboard() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`, {
          credentials: "include",
        })
        if (!res.ok) return

        const data = await res.json()

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
          <p className="text-muted-foreground mt-1">{courses.length} Active Courses</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course._id} className="border-none shadow-sm transition-shadow hover:shadow-md flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-card text-xs font-bold">
                      {getInitials(course.code)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm text-foreground">{course.code}</CardTitle>
                    <CardDescription className="text-xs">{course.term ?? "Current Term"}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">In Progress</Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <h3 className="font-medium text-foreground text-sm">{course.title}</h3>
              {course.instructor && (
                <p className="mt-1 text-xs text-muted-foreground">Instructor: {course.instructor}</p>
              )}
              {course.schedule && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span className="truncate">{course.schedule}</span>
                </div>
              )}

              <div className="mt-auto pt-4 border-t mt-4">
                <Link href={`/courses/${course._id}`} className="block w-full">
                  <Button className="w-full bg-primary text-primary-foreground">
                    Open Course →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
