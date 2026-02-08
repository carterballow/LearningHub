"use client"

import {
  BookOpen,
  Brain,
  Target,
  Clock,
  Flame,
  ChevronRight,
  Play,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const studySets = [
  {
    id: 1,
    title: "Data Structures Flashcards",
    course: "CS 210",
    cards: 48,
    mastered: 32,
    lastStudied: "Today",
    streak: 5,
  },
  {
    id: 2,
    title: "Organic Chemistry Reactions",
    course: "CHEM 202",
    cards: 65,
    mastered: 28,
    lastStudied: "Yesterday",
    streak: 3,
  },
  {
    id: 3,
    title: "Linear Algebra Theorems",
    course: "MATH 201",
    cards: 30,
    mastered: 18,
    lastStudied: "2 days ago",
    streak: 0,
  },
  {
    id: 4,
    title: "Rhetoric Terms & Concepts",
    course: "ENG 301",
    cards: 25,
    mastered: 20,
    lastStudied: "3 days ago",
    streak: 0,
  },
  {
    id: 5,
    title: "CS 101 - Final Exam Prep",
    course: "CS 101",
    cards: 80,
    mastered: 45,
    lastStudied: "1 week ago",
    streak: 0,
  },
  {
    id: 6,
    title: "History Key Dates & Events",
    course: "HIST 150",
    cards: 40,
    mastered: 15,
    lastStudied: "1 week ago",
    streak: 0,
  },
]

const studyGoals = [
  { label: "Daily Study Time", current: 2.5, target: 3, unit: "hours" },
  { label: "Cards Reviewed Today", current: 34, target: 50, unit: "cards" },
  { label: "Weekly Sessions", current: 4, target: 5, unit: "sessions" },
]

export function StudyContent() {
  const totalCards = studySets.reduce((sum, s) => sum + s.cards, 0)
  const totalMastered = studySets.reduce((sum, s) => sum + s.mastered, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Study</h2>
        <p className="text-muted-foreground mt-1">
          Review flashcards and track your study progress
        </p>
      </div>

      {/* Study Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{studySets.length}</p>
                <p className="text-xs text-muted-foreground">Study Sets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
                <Brain className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCards}</p>
                <p className="text-xs text-muted-foreground">Total Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMastered}</p>
                <p className="text-xs text-muted-foreground">Mastered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Flame className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Goals */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">Daily Goals</CardTitle>
          <CardDescription>Track your study targets for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {studyGoals.map((goal) => (
              <div key={goal.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{goal.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Sets */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Study Sets</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studySets.map((set) => {
            const progress = Math.round((set.mastered / set.cards) * 100)
            return (
              <Card key={set.id} className="border-none shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">{set.course}</Badge>
                    {set.streak > 0 && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <Flame className="h-3 w-3" />
                        <span>{set.streak}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-sm text-foreground mt-1">{set.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{set.mastered}/{set.cards} mastered</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{set.lastStudied}</span>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground h-7 text-xs">
                      <Play className="mr-1 h-3 w-3" />
                      Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
