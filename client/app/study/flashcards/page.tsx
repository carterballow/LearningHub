"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Layers, Loader2, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type Course = { _id: string; code: string; title: string }
type Flashcard = { front: string; back: string }
type Phase = "setup" | "loading" | "study" | "done"

function FlashcardsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCourseId = searchParams.get("courseId") || ""

  const [course, setCourse] = useState<Course | null>(null)
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(10)
  const [phase, setPhase] = useState<Phase>("setup")
  const [cards, setCards] = useState<Flashcard[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)
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

  async function startDeck() {
    setPhase("loading")
    setError("")
    try {
      const res = await fetch(`${API}/api/study/flashcards`, {
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
        setError(data.error || "Failed to generate flashcards.")
        setPhase("setup")
        return
      }
      setCards(data.flashcards || [])
      setIdx(0)
      setFlipped(false)
      setKnown(0)
      setUnknown(0)
      setPhase("study")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Can't reach the server.")
      setPhase("setup")
    }
  }

  function markKnown() { setKnown((k) => k + 1); advance() }
  function markUnknown() { setUnknown((u) => u + 1); advance() }

  function advance() {
    if (idx + 1 >= cards.length) {
      setPhase("done")
    } else {
      setIdx((i) => i + 1)
      setFlipped(false)
    }
  }

  function restart() {
    setPhase("setup")
    setCards([])
    setIdx(0)
    setFlipped(false)
    setKnown(0)
    setUnknown(0)
    setError("")
  }

  const card = cards[idx]
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
          <Layers className="h-5 w-5 text-primary" />
          Flashcards
        </h2>
        {course && (
          <Badge variant="secondary" className="ml-auto">{course.code}</Badge>
        )}
      </div>

      {/* Setup */}
      {phase === "setup" && (
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Configure your deck</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {course && (
              <div className="rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                Course: <span className="font-medium text-foreground">{course.code} — {course.title}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Topic <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. recursion, derivatives, Roman Empire..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Number of cards</label>
              <div className="flex gap-2">
                {[10, 15, 20].map((n) => (
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
            <Button onClick={startDeck} className="w-full">Generate Flashcards</Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {phase === "loading" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating flashcards with AI...</p>
          </CardContent>
        </Card>
      )}

      {/* Study */}
      {phase === "study" && card && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Card {idx + 1} of {cards.length}</span>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700">{known} known</Badge>
              <Badge className="bg-red-100 text-red-700">{unknown} review</Badge>
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${(idx / cards.length) * 100}%` }}
            />
          </div>

          <button onClick={() => setFlipped((f) => !f)} className="w-full text-left">
            <Card className="border-none shadow-sm min-h-[220px] flex flex-col cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 gap-3 text-center">
                <Badge variant="secondary" className="text-[10px]">
                  {flipped ? "Answer" : "Question — tap to flip"}
                </Badge>
                <p className="text-lg font-semibold text-foreground leading-relaxed">
                  {flipped ? card.back : card.front}
                </p>
                {!flipped && (
                  <p className="text-xs text-muted-foreground mt-2">Tap to reveal the answer</p>
                )}
              </CardContent>
            </Card>
          </button>

          {flipped ? (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={markUnknown}>
                <ThumbsDown className="h-4 w-4 mr-2" /> Still learning
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={markKnown}>
                <ThumbsUp className="h-4 w-4 mr-2" /> Got it
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setFlipped(true)}>
                Reveal Answer
              </Button>
              <Button variant="ghost" className="flex-1" onClick={advance}>
                Skip <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {phase === "done" && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Deck Complete</p>
              <p className="text-sm text-muted-foreground mt-1">{cards.length} cards reviewed</p>
            </div>
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-bold text-green-600">{known}</p>
                <p className="text-xs text-muted-foreground">Knew it</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xl font-bold text-red-500">{unknown}</p>
                <p className="text-xs text-muted-foreground">Still learning</p>
              </div>
            </div>
            {unknown > 0 && (
              <p className="text-sm text-muted-foreground max-w-xs">
                {unknown} card{unknown !== 1 ? "s" : ""} still need work — try asking the AI Tutor about them.
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4 mr-2" /> New Deck
              </Button>
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

export default function FlashcardsPage() {
  return (
    <DashboardLayout title="Flashcards">
      <Suspense fallback={null}>
        <FlashcardsContent />
      </Suspense>
    </DashboardLayout>
  )
}
