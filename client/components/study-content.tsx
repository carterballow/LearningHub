"use client"

import Link from "next/link"
import {
  Brain,
  Sparkles,
  MessagesSquare,
  ClipboardCheck,
  Layers,
  Timer,
  Target,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function ModeCard({
  title,
  description,
  icon,
  badge,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  badge?: string
  href: string
}) {
  return (
    <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm text-foreground">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {badge ? <Badge variant="secondary" className="text-xs">{badge}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button className="w-full bg-primary text-primary-foreground" size="sm">
            Start
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function StudyContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Study Hub</h2>
          <p className="text-muted-foreground mt-1">
            Choose a mode. Your goal is consistency: short reps, fast feedback.
          </p>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5" />
          Built for speed
        </Badge>
      </div>

      {/* “How to study” plan (your app’s suggested flow) */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">Recommended Loop (15–30 minutes)</CardTitle>
          <CardDescription>What students should do when they don’t know where to start</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ol className="list-decimal pl-5 space-y-2">
            <li><span className="text-foreground font-medium">Warm-up quiz:</span> 5 questions to find weak spots.</li>
            <li><span className="text-foreground font-medium">AI explain:</span> ask “explain like I’m new” and request an example.</li>
            <li><span className="text-foreground font-medium">Active recall:</span> flashcards or short-answer prompts.</li>
            <li><span className="text-foreground font-medium">Focus sprint:</span> 10 minutes, no tabs, one goal.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Modes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModeCard
          title="Quiz Mode"
          description="Fast questions, instant feedback"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
          badge="Best starter"
          href="/study/quiz"
        />
        <ModeCard
          title="AI Tutor"
          description="Ask questions, get step-by-step help"
          icon={<MessagesSquare className="h-4 w-4 text-muted-foreground" />}
          badge="Most used"
          href="/study/ai"
        />
        <ModeCard
          title="Flashcards"
          description="Active recall + spaced repetition"
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          href="/study/flashcards"
        />
        <ModeCard
          title="Focus Timer"
          description="25/5 or 10-minute sprints"
          icon={<Timer className="h-4 w-4 text-muted-foreground" />}
          href="/study/focus"
        />
        <ModeCard
          title="Weakness Tracker"
          description="See what you miss most"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          href="/study/weakness"
        />
        <ModeCard
          title="Study Plan"
          description="Pick a goal and get a checklist"
          icon={<Brain className="h-4 w-4 text-muted-foreground" />}
          href="/study/plan"
        />
      </div>

      <Separator />

      {/* Note for hackathon: these pages can be simple placeholders */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">Hackathon-friendly implementation</CardTitle>
          <CardDescription>All modes can be placeholders now, real later</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          For the demo: each mode page can be a simple UI card saying “Coming soon”
          with one interactive element (a sample quiz question, a textarea for AI prompts, etc.).
        </CardContent>
      </Card>
    </div>
  )
}
