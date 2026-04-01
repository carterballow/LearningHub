"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pause, Play, RotateCcw, Timer } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Mode = "work" | "break"

const PRESETS = [
  { label: "Pomodoro", work: 25, rest: 5 },
  { label: "Short sprint", work: 10, rest: 2 },
  { label: "Deep work", work: 50, rest: 10 },
]

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function FocusContent() {
  const [preset, setPreset] = useState(0)
  const [mode, setMode] = useState<Mode>("work")
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].work * 60)
  const [running, setRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [goal, setGoal] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selected = PRESETS[preset]

  // Reset timer when preset changes
  useEffect(() => {
    setRunning(false)
    setMode("work")
    setSecondsLeft(PRESETS[preset].work * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [preset])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Switch modes
          setMode((m) => {
            if (m === "work") {
              setSessionsCompleted((n) => n + 1)
              setSecondsLeft(PRESETS[preset].rest * 60)
              return "break"
            } else {
              setSecondsLeft(PRESETS[preset].work * 60)
              return "work"
            }
          })
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, preset])

  function reset() {
    setRunning(false)
    setMode("work")
    setSecondsLeft(selected.work * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const totalSeconds = mode === "work" ? selected.work * 60 : selected.rest * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const circumference = 2 * Math.PI * 90
  const strokeDash = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/study" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Study Hub
        </Link>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Focus Timer
        </h2>
        {sessionsCompleted > 0 && (
          <Badge variant="secondary" className="ml-auto">{sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""} done</Badge>
        )}
      </div>

      {/* Preset selector */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPreset(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${preset === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Goal input */}
      <input
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="What's your focus goal for this session? (optional)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        disabled={running}
      />

      {/* Timer circle */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          {/* Mode badge */}
          <Badge className={mode === "work" ? "bg-primary text-primary-foreground" : "bg-green-100 text-green-700"}>
            {mode === "work" ? "Focus" : "Break"}
          </Badge>

          {/* SVG circle */}
          <div className="relative flex items-center justify-center">
            <svg width="220" height="220" className="-rotate-90">
              {/* Background track */}
              <circle
                cx="110"
                cy="110"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              {/* Progress arc */}
              <circle
                cx="110"
                cy="110"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                className={mode === "work" ? "text-primary" : "text-green-500"}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold tabular-nums text-foreground">
                {pad(minutes)}:{pad(seconds)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {mode === "work" ? `${selected.work} min focus` : `${selected.rest} min break`}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={reset}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              className="flex-1 h-12 text-base"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? (
                <><Pause className="h-5 w-5 mr-2" /> Pause</>
              ) : (
                <><Play className="h-5 w-5 mr-2" /> {secondsLeft === selected.work * 60 ? "Start" : "Resume"}</>
              )}
            </Button>
          </div>

          {goal && (
            <div className="w-full rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Goal</p>
              <p className="text-sm font-medium text-foreground">{goal}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick tips</p>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <li>• Close all other tabs during a focus session</li>
            <li>• During breaks, step away from your screen</li>
            <li>• Do {Math.ceil(4 * (selected.work / 25))} sessions → take a longer 15-min break</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FocusPage() {
  return (
    <DashboardLayout title="Focus Timer">
      <FocusContent />
    </DashboardLayout>
  )
}
