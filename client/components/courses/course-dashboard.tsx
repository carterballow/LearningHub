"use client"

import { BookOpen, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const courses = [
  {
    id: "cs101",
    name: "Introduction to Computer Science",
    code: "CS 101",
    instructor: "Prof. Williams",
    schedule: "Mon/Wed 9:00 AM",
    progress: 72,
    grade: "A",
    students: 45,
    initials: "CS",
    color: "bg-primary",
    nextClass: "Tomorrow, 9:00 AM",
    description: "Fundamental concepts of programming, algorithms, and data structures.",
  },
  {
    id: "math201",
    name: "Linear Algebra",
    code: "MATH 201",
    instructor: "Dr. Chen",
    schedule: "Tue/Thu 11:00 AM",
    progress: 65,
    grade: "B+",
    students: 38,
    initials: "MA",
    color: "bg-chart-3",
    nextClass: "Today, 11:00 AM",
    description: "Vector spaces, linear transformations, eigenvalues, and matrices.",
  },
  {
    id: "chem202",
    name: "Organic Chemistry",
    code: "CHEM 202",
    instructor: "Prof. Patel",
    schedule: "Mon/Wed/Fri 2:00 PM",
    progress: 58,
    grade: "B",
    students: 32,
    initials: "CH",
    color: "bg-destructive",
    nextClass: "Today, 2:00 PM",
    description: "Structure, properties, and reactions of organic compounds.",
  },
  {
    id: "eng301",
    name: "English Composition",
    code: "ENG 301",
    instructor: "Dr. Smith",
    schedule: "Tue/Thu 1:00 PM",
    progress: 80,
    grade: "A-",
    students: 28,
    initials: "EN",
    color: "bg-accent",
    nextClass: "Tomorrow, 1:00 PM",
    description: "Advanced writing techniques, rhetoric, and critical analysis.",
  },
  {
    id: "cs210",
    name: "Data Structures",
    code: "CS 210",
    instructor: "Dr. Lee",
    schedule: "Mon/Wed 4:00 PM",
    progress: 50,
    grade: "A",
    students: 35,
    initials: "DS",
    color: "bg-primary",
    nextClass: "Tomorrow, 4:00 PM",
    description: "Trees, graphs, hash tables, sorting algorithms, and complexity.",
  },
  {
    id: "hist150",
    name: "World History",
    code: "HIST 150",
    instructor: "Prof. Garcia",
    schedule: "Fri 10:00 AM",
    progress: 45,
    grade: "A-",
    students: 60,
    initials: "HI",
    color: "bg-chart-3",
    nextClass: "Friday, 10:00 AM",
    description: "Major events and civilizations from ancient to modern times.",
  },
]

export function CourseDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
          <p className="text-muted-foreground mt-1">
            Spring 2026 Semester - 6 Active Courses
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Catalog
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border-none shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${course.color} text-card text-xs font-bold`}>
                      {course.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm text-foreground">{course.code}</CardTitle>
                    <CardDescription className="text-xs">{course.instructor}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {course.grade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-foreground text-sm">{course.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {course.description}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1.5" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.schedule}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Next: {course.nextClass}
                </span>
                <Link
                  href={`/courses/${course.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Open Course
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
