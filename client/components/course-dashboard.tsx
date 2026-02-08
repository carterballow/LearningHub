"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const API_BASE = "http://localhost:4000"

type Course = {
  _id: string
  title: string
  code: string
  term?: string
  color?: string
}

// fake visual extras (not in DB)
function randomProgress() {
  return Math.floor(40 + Math.random() * 50)
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

        // handle both API shapes
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
          <p className="text-muted-foreground mt-1">
            {courses.length} Active Courses
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Catalog
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const progress = randomProgress()

          return (
            <Card
              key={course._id}
              className="border-none shadow-sm transition-shadow hover:shadow-md"
            >
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
                      <CardDescription className="text-xs">
                        {course.term ?? "Current Term"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    In Progress
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <h3 className="font-medium text-foreground text-sm">{course.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  Course materials, assignments, and progress tracking.
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Class</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Schedule TBD</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Active
                  </span>
                  <Link
                    href={`/courses/${course._id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Open Course
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
