"use client"

import Link from "next/link"
import { BookOpen, FileText, FlaskConical, PlayCircle, ExternalLink, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function CoursePageContent({ courseId }: { courseId: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <h2 className="text-2xl font-bold text-foreground">Open Course</h2>
          <p className="text-muted-foreground">
            This is a placeholder course page (same layout for every course).
          </p>

          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Course ID: {courseId}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Syllabus
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <PlayCircle className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Study */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Home</CardTitle>
            <CardDescription>Your main hub for learning content</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Notes</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Keep your lecture notes and key ideas here.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Open Notes
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Practice</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Problems, drills, and review sets.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Start Practice
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Assignments</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  View what’s due and what’s done (we’ll wire this later).
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  View Assignments
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Lectures</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Links to recordings or slides.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Open Lectures
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Study Hub</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Quiz mode, AI help, flashcards, and focus tools.
              </p>
              <Link href="/study">
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Open Study
                </Button>
              </Link>
            </div>


            <Separator />

            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="text-sm font-medium text-foreground">Quick Plan</p>
              <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground space-y-1">
                <li>Review last lecture notes</li>
                <li>Do 3 practice problems</li>
                <li>Check assignments due this week</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Right: Overview / Resources */}
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Course Overview</CardTitle>
              <CardDescription>Basic info for now</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Instructor: TBD</p>
              <p className="mt-1">Schedule: TBD</p>
              <p className="mt-1">Term: TBD</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Resources</CardTitle>
              <CardDescription>Common links</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Syllabus Link
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Office Hours
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Textbook / Readings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
