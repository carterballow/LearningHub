"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, ClipboardCheck, Loader2, XCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type Course = { _id: string; code: string; title: string }
type Question = {
  question: string
  options: string[]
  answer: string
  explanation: string
}

type Phase = "setup" | "loading" | "quiz" | "done"

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCourseId = searchParams.get("courseId") || ""

  const [course, setCourse] = useState<Course | null>(null)
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(5)
  const [phase, setPhase] = useState<Phase>("setup")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!urlCourseId) return
    fetch(`${API}/api/courses`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null }
        return r.json()
      })
      .then((d) => {
        if (d) {
          const found = (d.courses || []).find((c: Course) => c._id === urlCourseId)
          if (found) setCourse(found)
        }
      })
      .catch(() => {})
  }, [urlCourseId, router])

  async function startQuiz() {
    setPhase("loading")
    setError("")
    try {
      const res = await fetch(`${API}/api/study/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: urlCourseId || null,
          topic: topic.trim() || undefined,
          count,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to generate quiz.")
        setPhase("setup")
        return
      }
      setQuestions(data.questions || [])
      setCurrentIdx(0)
      setSelectedAnswer(null)
      setScore(0)
      setPhase("quiz")
    } catch {
      setError("Can't reach the server. Make sure the backend is running.")
      setPhase("setup")
    }
  }

  function handleAnswer(letter: string) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(letter)
    if (letter === questions[currentIdx].answer) {
      setScore((s) => s + 1)
    }
  }

  function next() {
    if (currentIdx + 1 >= questions.length) {
      setPhase("done")
    } else {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
    }
  }

  function restart() {
    setPhase("setup")
    setQuestions([])
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setScore(0)
    setError("")
  }

  const q = questions[currentIdx]
  const backHref = urlCourseId ? `/study?courseId=${urlCourseId}` : "/study"

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Study Hub
        </Link>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Quiz Mode
        </h2>
        {course && (
          <Badge variant="secondary" className="ml-auto">{course.code}</Badge>
        )}
      </div>

      {/* Setup */}
      {phase === "setup" && (
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Configure your quiz</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {course && (
              <div className="rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                Course: <span className="font-medium text-foreground">{course.code} — {course.title}</span>
              </div>
            )}

            {/* Topic */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Topic <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. pointers, limits, World War II..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Count */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Number of questions</label>
              <div className="flex gap-2">
                {[5, 10, 15].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${count === n ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button onClick={startQuiz} className="w-full">
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {phase === "loading" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating your quiz with AI...</p>
          </CardContent>
        </Card>
      )}

      {/* Quiz */}
      {phase === "quiz" && q && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Question {currentIdx + 1} of {questions.length}</span>
            <Badge variant="secondary">{score} correct</Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4">
              <p className="text-base font-semibold text-foreground leading-relaxed">{q.question}</p>

              <div className="flex flex-col gap-2">
                {q.options.map((opt) => {
                  const letter = opt.charAt(0)
                  const isCorrect = letter === q.answer
                  const isSelected = selectedAnswer === letter
                  let cls = "flex items-start gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors "
                  if (selectedAnswer === null) {
                    cls += "hover:bg-secondary/60"
                  } else if (isCorrect) {
                    cls += "border-green-500 bg-green-50 text-green-800"
                  } else if (isSelected) {
                    cls += "border-red-400 bg-red-50 text-red-800"
                  } else {
                    cls += "opacity-50"
                  }

                  return (
                    <button key={letter} className={cls} onClick={() => handleAnswer(letter)} disabled={selectedAnswer !== null}>
                      <span className="shrink-0 font-semibold">{letter})</span>
                      <span className="text-left">{opt.slice(3)}</span>
                      {selectedAnswer !== null && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 ml-auto text-green-600" />}
                      {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 ml-auto text-red-500" />}
                    </button>
                  )
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Explanation: </span>{q.explanation}
                </div>
              )}

              {selectedAnswer !== null && (
                <Button onClick={next} className="w-full">
                  {currentIdx + 1 >= questions.length ? "See Results" : "Next Question"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Done */}
      {phase === "done" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${score / questions.length >= 0.8 ? "bg-green-100" : score / questions.length >= 0.6 ? "bg-yellow-100" : "bg-red-100"}`}>
              {score / questions.length >= 0.8
                ? <CheckCircle2 className="h-7 w-7 text-green-600" />
                : score / questions.length >= 0.6
                  ? <CheckCircle2 className="h-7 w-7 text-yellow-600" />
                  : <XCircle className="h-7 w-7 text-red-500" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{score}/{questions.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((score / questions.length) * 100)}% correct
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {score / questions.length >= 0.8
                ? "Great job! You clearly know this material well."
                : score / questions.length >= 0.6
                ? "Solid effort — review the questions you missed."
                : "Keep studying! Use the AI Tutor to go over the tricky concepts."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={restart}>Try Again</Button>
              <Link href={urlCourseId ? `/study/ai?courseId=${urlCourseId}` : "/study/ai"}>
                <Button>Ask AI Tutor</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <DashboardLayout title="Quiz Mode">
      <Suspense fallback={null}>
        <QuizContent />
      </Suspense>
    </DashboardLayout>
  )
}
