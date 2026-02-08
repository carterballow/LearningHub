"use client"

import { useState } from "react"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const assignments = [
  {
    id: 1,
    title: "Linear Algebra Problem Set 5",
    course: "MATH 201",
    due: "Feb 8, 2026",
    points: 100,
    status: "pending",
    priority: "high",
    description: "Complete exercises 5.1-5.4 on eigenvalues and eigenvectors.",
  },
  {
    id: 2,
    title: "Research Paper Draft",
    course: "ENG 301",
    due: "Feb 10, 2026",
    points: 200,
    status: "in-progress",
    priority: "high",
    description: "Submit first draft of research paper on rhetoric in digital media.",
  },
  {
    id: 3,
    title: "Data Structures Lab Report",
    course: "CS 210",
    due: "Feb 12, 2026",
    points: 50,
    status: "pending",
    priority: "medium",
    description: "Document your BST implementation with analysis of time complexity.",
  },
  {
    id: 4,
    title: "History Essay Outline",
    course: "HIST 150",
    due: "Feb 14, 2026",
    points: 75,
    status: "pending",
    priority: "low",
    description: "Outline for the essay on Industrial Revolution impacts.",
  },
  {
    id: 5,
    title: "Programming Assignment 3",
    course: "CS 101",
    due: "Feb 15, 2026",
    points: 100,
    status: "pending",
    priority: "medium",
    description: "Implement a recursive sorting algorithm and analyze its complexity.",
  },
  {
    id: 6,
    title: "Chemistry Lab Write-up",
    course: "CHEM 202",
    due: "Feb 5, 2026",
    points: 50,
    status: "submitted",
    priority: "none",
    description: "Write-up of Experiment 7 on esterification reactions.",
    grade: "47/50",
  },
  {
    id: 7,
    title: "Reading Response 4",
    course: "ENG 301",
    due: "Feb 3, 2026",
    points: 25,
    status: "graded",
    priority: "none",
    description: "Response to chapters 8-10 of 'The Art of Rhetoric'.",
    grade: "23/25",
  },
  {
    id: 8,
    title: "Problem Set 4",
    course: "MATH 201",
    due: "Feb 1, 2026",
    points: 100,
    status: "graded",
    priority: "none",
    description: "Exercises on linear transformations.",
    grade: "92/100",
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "graded":
      return <CheckCircle2 className="h-5 w-5 text-primary" />
    case "submitted":
      return <CheckCircle2 className="h-5 w-5 text-chart-3" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-accent" />
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge className="bg-destructive text-destructive-foreground text-[10px]">High</Badge>
    case "medium":
      return <Badge className="bg-accent text-accent-foreground text-[10px]">Medium</Badge>
    case "low":
      return <Badge variant="secondary" className="text-[10px]">Low</Badge>
    default:
      return null
  }
}

export function AssignmentsContent() {
  const [tab, setTab] = useState("upcoming")

  const upcoming = assignments.filter(
    (a) => a.status === "pending" || a.status === "in-progress"
  )
  const completed = assignments.filter(
    (a) => a.status === "submitted" || a.status === "graded"
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
          <p className="text-muted-foreground mt-1">
            {upcoming.length} upcoming, {completed.length} completed
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Due This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {upcoming.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
                  >
                    {getStatusIcon(assignment.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {assignment.title}
                        </p>
                        {getPriorityBadge(assignment.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {assignment.course} - {assignment.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">{assignment.points} pts</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{assignment.due}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {completed.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
                  >
                    {getStatusIcon(assignment.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {assignment.course} - Due: {assignment.due}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge variant="secondary" className="font-mono">
                        {assignment.grade}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
