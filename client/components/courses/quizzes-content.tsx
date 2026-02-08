"use client"

import {
  HelpCircle,
  Clock,
  CheckCircle2,
  Play,
  Lock,
  Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const quizzes = [
  {
    id: 1,
    title: "Midterm Quiz - Organic Chemistry",
    course: "CHEM 202",
    date: "Feb 11, 2026",
    duration: "60 min",
    questions: 40,
    status: "upcoming",
    topics: ["Alkanes", "Alkenes", "Functional Groups"],
  },
  {
    id: 2,
    title: "Pop Quiz - Binary Trees",
    course: "CS 210",
    date: "Feb 13, 2026",
    duration: "20 min",
    questions: 10,
    status: "upcoming",
    topics: ["BST", "Traversals", "Balancing"],
  },
  {
    id: 3,
    title: "Chapter 7 Quiz",
    course: "MATH 201",
    date: "Feb 16, 2026",
    duration: "30 min",
    questions: 15,
    status: "locked",
    topics: ["Eigenvalues", "Diagonalization"],
  },
  {
    id: 4,
    title: "Weekly Quiz 5 - Algorithms",
    course: "CS 101",
    date: "Feb 4, 2026",
    duration: "25 min",
    questions: 12,
    status: "completed",
    score: 11,
    total: 12,
    topics: ["Sorting", "Recursion"],
  },
  {
    id: 5,
    title: "Quiz 3 - Functional Groups",
    course: "CHEM 202",
    date: "Feb 2, 2026",
    duration: "15 min",
    questions: 8,
    status: "completed",
    score: 7,
    total: 8,
    topics: ["Alcohols", "Aldehydes"],
  },
  {
    id: 6,
    title: "Reading Comprehension Quiz",
    course: "ENG 301",
    date: "Jan 30, 2026",
    duration: "20 min",
    questions: 10,
    status: "completed",
    score: 9,
    total: 10,
    topics: ["Rhetoric", "Analysis"],
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-accent text-accent-foreground text-[10px]">Upcoming</Badge>
    case "locked":
      return <Badge variant="secondary" className="text-[10px]">Locked</Badge>
    case "completed":
      return <Badge className="bg-primary text-primary-foreground text-[10px]">Completed</Badge>
    default:
      return null
  }
}

function getStatusAction(status: string) {
  switch (status) {
    case "upcoming":
      return (
        <Button size="sm" className="bg-primary text-primary-foreground">
          <Play className="mr-1 h-3 w-3" />
          Start
        </Button>
      )
    case "locked":
      return (
        <Button size="sm" variant="secondary" disabled>
          <Lock className="mr-1 h-3 w-3" />
          Locked
        </Button>
      )
    case "completed":
      return (
        <Button size="sm" variant="outline">
          Review
        </Button>
      )
    default:
      return null
  }
}

export function QuizzesContent() {
  const upcoming = quizzes.filter((q) => q.status === "upcoming" || q.status === "locked")
  const completed = quizzes.filter((q) => q.status === "completed")
  const avgScore = completed.reduce((sum, q) => sum + ((q.score ?? 0) / (q.total ?? 1)) * 100, 0) / completed.length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Quizzes</h2>
        <p className="text-muted-foreground mt-1">
          {upcoming.length} upcoming, {completed.length} completed
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <HelpCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.round(avgScore)}%</p>
                <p className="text-xs text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
                <CheckCircle2 className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Quizzes */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming Quizzes</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((quiz) => (
            <Card key={quiz.id} className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {quiz.course}
                  </Badge>
                  {getStatusBadge(quiz.status)}
                </div>
                <CardTitle className="text-sm text-foreground">{quiz.title}</CardTitle>
                <CardDescription className="text-xs">{quiz.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    <span>{quiz.questions} questions</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {quiz.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-[10px] font-normal">
                      {topic}
                    </Badge>
                  ))}
                </div>
                {getStatusAction(quiz.status)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Quizzes */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Completed Quizzes</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y">
              {completed.map((quiz) => (
                <div key={quiz.id} className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{quiz.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {quiz.course} - {quiz.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {quiz.score}/{quiz.total}
                      </p>
                      <Progress
                        value={((quiz.score ?? 0) / (quiz.total ?? 1)) * 100}
                        className="h-1 w-16 mt-1"
                      />
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
