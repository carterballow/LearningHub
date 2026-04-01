"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bot, Loader2, Send, User } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const API = "http://localhost:4000"

type Course = { _id: string; code: string; title: string }
type Message = { role: "user" | "assistant"; content: string }

function AiTutorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCourseId = searchParams.get("courseId") || ""

  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState(urlCourseId)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: urlCourseId
        ? "Hi! I'm your AI tutor. Ask me anything about this course — I know your assignments, deadlines, and content. Try: \"What should I focus on for the midterm?\" or \"Explain the concept from last week.\""
        : "Hi! I'm your AI tutor. Select a course above, then ask me anything — I know your assignments, deadlines, and course content.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API}/api/courses`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const list = data.courses || []
        setCourses(list)
        if (!urlCourseId && list.length > 0) {
          setSelectedCourseId(list[0]._id)
        }
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")

    const newHistory: Message[] = [...messages, { role: "user", content: userMessage }]
    setMessages(newHistory)
    setLoading(true)

    try {
      const res = await fetch(`${API}/api/study/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: selectedCourseId || null,
          message: userMessage,
          history: messages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages([...newHistory, { role: "assistant", content: data.error || "Sorry, something went wrong." }])
      } else {
        setMessages([...newHistory, { role: "assistant", content: data.reply }])
      }
    } catch {
      setMessages([...newHistory, { role: "assistant", content: "Sorry, I couldn't reach the server. Make sure the backend is running." }])
    } finally {
      setLoading(false)
    }
  }

  const selectedCourse = courses.find((c) => c._id === selectedCourseId)
  const backHref = urlCourseId ? `/study?courseId=${urlCourseId}` : "/study"

  const suggestionPrompts = [
    "What should I study first for the next exam?",
    "Explain the hardest concept in this course",
    "What's due in the next week?",
    "Give me a 5-question practice quiz",
  ]

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Study Hub
          </Link>
          <span className="text-muted-foreground">/</span>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Tutor
          </h2>
        </div>
        <Badge className="bg-primary/10 text-primary">Powered by Gemini</Badge>
      </div>

      {/* Course selector — only shown when no courseId in URL */}
      {!urlCourseId && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Course:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCourseId("")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!selectedCourseId ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All courses
              </button>
              {courses.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCourseId(c._id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCourseId === c._id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat area */}
      <Card className="border-none shadow-sm flex-1 flex flex-col min-h-[400px]">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {selectedCourse
              ? `Chatting about ${selectedCourse.code}: ${selectedCourse.title}`
              : "General study assistant — select a course for specific help"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {suggestionPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="text-xs bg-secondary/60 hover:bg-secondary text-foreground px-3 py-1.5 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ask anything about your course..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              disabled={loading}
            />
            <Button size="sm" onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AiTutorPage() {
  return (
    <DashboardLayout title="AI Tutor">
      <Suspense fallback={null}>
        <AiTutorContent />
      </Suspense>
    </DashboardLayout>
  )
}
