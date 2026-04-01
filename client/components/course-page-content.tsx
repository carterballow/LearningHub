"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Loader2,
  MapPin,
  MessagesSquare,
  Paperclip,
  Plus,
  Send,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// ─── Types ────────────────────────────────────────────────────────────────────

type CourseInfo = {
  id: string
  code: string
  title: string
  term: string
  color: string
  instructor: string
  instructorEmail: string
  schedule: string
  location: string
  description: string
  syllabusUrl: string
  gradingScheme: Record<string, number>
}

type AssignmentItem = {
  id: string
  title: string
  description: string
  type: "homework" | "quiz" | "project" | "reading" | "exam"
  dueDate: string
  maxScore: number
  attachmentUrl?: string
  userAssignmentId: string | null
  status: "todo" | "in-progress" | "done"
  grade: number | null
  feedback: string | null
  submissionText: string | null
  submissionFileUrl?: string | null
  submittedAt: string | null
}

type StudentSubmission = {
  userAssignmentId: string
  student: { id: string; name: string; email: string }
  assignmentTitle: string
  assignmentType: string
  maxScore: number
  dueDate: string
  status: string
  grade: number | null
  feedback: string | null
  submissionText: string | null
  submissionFileUrl?: string | null
  submittedAt: string | null
}

type Announcement = {
  id: string
  title: string
  body: string
  authorName: string
  createdAt: string
}

type Post = {
  id: string
  content: string
  isAnonymous: boolean
  authorName: string
  isOwn: boolean
  createdAt: string
}

type CourseFile = {
  id: string
  name: string
  url: string
  description: string
  uploaderName: string
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  exam: "bg-red-100 text-red-700",
  quiz: "bg-red-100 text-red-700",
  project: "bg-purple-100 text-purple-700",
  homework: "bg-yellow-100 text-yellow-700",
  reading: "bg-yellow-100 text-yellow-700",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due = new Date(iso); due.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return "Past due"
  if (diff === 0) return "Due today"
  if (diff === 1) return "Due tomorrow"
  return `${diff} days left`
}

function letterGrade(pct: number) {
  if (pct >= 97) return "A+"
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  if (pct >= 70) return "C-"
  if (pct >= 60) return "D"
  return "F"
}

// ─── Student Assignment Row ───────────────────────────────────────────────────

function AssignmentRow({ a, onSubmit, onStatusChange }: {
  a: AssignmentItem
  onSubmit: (id: string, text: string, fileUrl?: string) => Promise<void>
  onStatusChange: (id: string, status: string) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState("")
  const [fileUploading, setFileUploading] = useState(false)
  const submitFileRef = useRef<HTMLInputElement>(null)

  async function uploadSubmissionFile(file: File) {
    setFileUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch(`${API}/api/upload/submission-file`, { method: "POST", credentials: "include", body: fd })
      if (res.ok) {
        const data = await res.json()
        setUploadedFileUrl(data.url?.startsWith("/uploads/") ? `${API}${data.url}` : data.url)
      }
    } finally {
      setFileUploading(false)
    }
  }

  const isPast = new Date(a.dueDate) < new Date()
  const hasGrade = a.grade !== null && a.grade !== undefined
  const pct = hasGrade ? Math.round((a.grade! / a.maxScore) * 100) : null

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 p-3 cursor-pointer select-none" onClick={() => setExpanded((v) => !v)}>
        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[a.type] ?? "bg-secondary text-secondary-foreground"}`}>
          {a.type === "homework" ? "assignment" : a.type}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${a.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{a.title}</p>
          <p className="text-xs text-muted-foreground">{formatDate(a.dueDate)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasGrade ? (
            <Badge variant="secondary" className="text-xs font-bold">{letterGrade(pct!)} · {pct}%</Badge>
          ) : a.submittedAt ? (
            <Badge className="bg-green-100 text-green-700 text-xs">Submitted</Badge>
          ) : isPast ? (
            <Badge variant="destructive" className="text-xs">Past Due</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">{daysUntil(a.dueDate)}</span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t px-3 pb-3 pt-3 flex flex-col gap-3">
          {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}

          {a.attachmentUrl && (
            <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Paperclip className="h-4 w-4" /> View attached PDF
            </a>
          )}

          {hasGrade && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  Grade: {a.grade}/{a.maxScore} — {letterGrade(pct!)} ({pct}%)
                </span>
              </div>
              {a.feedback && <p className="text-sm text-green-800 mt-1"><span className="font-medium">Feedback: </span>{a.feedback}</p>}
            </div>
          )}

          {a.submittedAt && !hasGrade && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm text-blue-700">
                <CheckCircle2 className="inline h-4 w-4 mr-1" />
                Submitted on {formatDate(a.submittedAt)} — awaiting grade
              </p>
              {a.submissionText && <p className="text-xs text-blue-600 mt-1 line-clamp-2">"{a.submissionText}"</p>}
              {a.submissionFileUrl && (
                <a href={a.submissionFileUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline mt-1">
                  <Paperclip className="h-3 w-3" /> View submitted PDF
                </a>
              )}
            </div>
          )}

          {!a.submittedAt && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              {(["todo", "in-progress", "done"] as const).map((s) => (
                <button key={s} disabled={saving}
                  onClick={async (e) => { e.stopPropagation(); setSaving(true); await onStatusChange(a.userAssignmentId!, s); setSaving(false) }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${a.status === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {!a.submittedAt && a.userAssignmentId && (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full rounded-md border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Write your answer, notes, or a summary of your work... (optional if uploading a PDF)"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input ref={submitFileRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSubmissionFile(f); e.target.value = "" }} />
              {uploadedFileUrl ? (
                <div className="flex items-center gap-2 text-sm">
                  <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" /> PDF ready
                  </a>
                  <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setUploadedFileUrl("")}>Remove</button>
                </div>
              ) : (
                <Button variant="outline" size="sm" disabled={fileUploading} onClick={() => submitFileRef.current?.click()} className="w-fit">
                  {fileUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
                  Attach PDF
                </Button>
              )}
              <Button size="sm" disabled={submitting || fileUploading || (!text.trim() && !uploadedFileUrl)}
                onClick={async () => {
                  setSubmitting(true)
                  await onSubmit(a.userAssignmentId!, text, uploadedFileUrl || undefined)
                  setText(""); setUploadedFileUrl("")
                  setSubmitting(false)
                }}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Assignment
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Teacher Grading Row ──────────────────────────────────────────────────────

function GradingRow({ sub, onGrade }: {
  sub: StudentSubmission
  onGrade: (uaId: string, grade: number, feedback: string) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [grade, setGrade] = useState(sub.grade != null ? String(sub.grade) : "")
  const [feedback, setFeedback] = useState(sub.feedback || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 p-3 cursor-pointer select-none" onClick={() => setExpanded((v) => !v)}>
        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[sub.assignmentType] ?? "bg-secondary text-secondary-foreground"}`}>
          {sub.assignmentType === "homework" ? "assignment" : sub.assignmentType}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{sub.assignmentTitle}</p>
          <p className="text-xs text-muted-foreground">{sub.student.name} · {sub.student.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {sub.grade != null ? (
            <Badge variant="secondary" className="text-xs">{sub.grade}/{sub.maxScore}</Badge>
          ) : sub.submittedAt ? (
            <Badge className="bg-yellow-100 text-yellow-700 text-xs">Needs grading</Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">Not submitted</Badge>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t px-3 pb-3 pt-3 flex flex-col gap-3">
          {sub.submittedAt ? (
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Student submission:</p>
              {sub.submissionText && <p className="text-sm text-foreground whitespace-pre-wrap">{sub.submissionText}</p>}
              {sub.submissionFileUrl && (
                <a href={sub.submissionFileUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1">
                  <Paperclip className="h-3.5 w-3.5" /> View submitted PDF
                </a>
              )}
              <p className="text-xs text-muted-foreground mt-1">Submitted: {formatDate(sub.submittedAt)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No submission yet.</p>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground w-20">Grade (/{sub.maxScore}):</label>
              <input type="number" min="0" max={sub.maxScore}
                className="w-24 rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground w-20">Feedback:</label>
              <input type="text"
                className="flex-1 rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional written feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </div>
            <Button size="sm" disabled={saving || !grade}
              onClick={async () => { setSaving(true); await onGrade(sub.userAssignmentId, Number(grade), feedback); setSaved(true); setSaving(false); setTimeout(() => setSaved(false), 2000) }}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="mr-2 h-4 w-4" /> : null}
              {saved ? "Saved!" : "Save Grade"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ course, role, onSyllabusUpdate }: {
  course: CourseInfo
  role: "student" | "teacher"
  onSyllabusUpdate: (url: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  async function uploadSyllabus(file: File) {
    setUploading(true)
    setUploadError("")
    const form = new FormData()
    form.append("syllabus", file)
    const res = await fetch(`${API}/api/upload/syllabus/${course.id}`, {
      method: "POST",
      credentials: "include",
      body: form,
    })
    setUploading(false)
    if (res.ok) {
      const data = await res.json()
      onSyllabusUpdate(`${API}${data.url}`)
    } else {
      const err = await res.json().catch(() => ({}))
      setUploadError(err?.error || "Upload failed.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{course.code}: {course.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{course.term}</p>
      </div>

      {/* Course info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Instructor</p>
              <p className="text-sm font-medium text-foreground">{course.instructor}</p>
              <p className="text-xs text-muted-foreground">{course.instructorEmail}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Schedule</p>
              <p className="text-sm font-medium text-foreground">{course.schedule}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{course.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {course.description && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">About this course</p>
            <p className="text-sm text-foreground leading-relaxed">{course.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Syllabus */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base text-foreground">Syllabus</CardTitle>
            </div>
            {role === "teacher" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSyllabus(f); e.target.value = "" }}
                />
                <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {course.syllabusUrl ? "Replace PDF" : "Upload PDF"}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {uploadError && <p className="text-xs text-destructive mb-2">{uploadError}</p>}
          {course.syllabusUrl ? (
            <a
              href={course.syllabusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Syllabus PDF
            </a>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {role === "teacher" ? "No syllabus posted yet. Upload a PDF above." : "No syllabus posted yet."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Assignments Tab ──────────────────────────────────────────────────────────

function AssignmentsTab({ course, role, assignments, setAssignments, studentSubmissions, setStudentSubmissions }: {
  course: CourseInfo
  role: "student" | "teacher"
  assignments: AssignmentItem[]
  setAssignments: React.Dispatch<React.SetStateAction<AssignmentItem[]>>
  studentSubmissions: StudentSubmission[]
  setStudentSubmissions: React.Dispatch<React.SetStateAction<StudentSubmission[]>>
}) {
  const [activeView, setActiveView] = useState<"list" | "grading" | "create">("list")
  const [form, setForm] = useState({ title: "", description: "", type: "homework", dueDate: "", maxScore: "100" })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [attachmentUrl, setAttachmentUrl] = useState("")
  const [attachmentUploading, setAttachmentUploading] = useState(false)
  const attachmentInputRef = useRef<HTMLInputElement>(null)

  const needsGrading = studentSubmissions.filter((s) => s.submittedAt && s.grade == null)
  const upcoming = assignments.filter((a) => new Date(a.dueDate) > new Date())
  const past = assignments.filter((a) => new Date(a.dueDate) <= new Date())

  async function handleSubmit(uaId: string, text: string, fileUrl?: string) {
    const res = await fetch(`${API}/api/userassignments/${uaId}/submit`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ submissionText: text, submissionFileUrl: fileUrl }),
    })
    if (!res.ok) return
    setAssignments((prev) => prev.map((a) => a.userAssignmentId === uaId ? { ...a, submittedAt: new Date().toISOString(), status: "done", submissionFileUrl: fileUrl } : a))
  }

  async function handleStatusChange(uaId: string, status: string) {
    const res = await fetch(`${API}/api/userassignments/${uaId}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return
    setAssignments((prev) => prev.map((a) => a.userAssignmentId === uaId ? { ...a, status: status as AssignmentItem["status"] } : a))
  }

  async function handleGrade(uaId: string, grade: number, feedback: string) {
    const res = await fetch(`${API}/api/userassignments/${uaId}/grade`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ grade, feedback }),
    })
    if (!res.ok) return
    setStudentSubmissions((prev) => prev.map((s) => s.userAssignmentId === uaId ? { ...s, grade, feedback } : s))
  }

  async function uploadAttachment(file: File) {
    setAttachmentUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch(`${API}/api/upload/assignment-file`, { method: "POST", credentials: "include", body: fd })
      if (res.ok) {
        const data = await res.json()
        setAttachmentUrl(data.url?.startsWith("/uploads/") ? `${API}${data.url}` : data.url)
      }
    } finally {
      setAttachmentUploading(false)
    }
  }

  async function handleCreate() {
    setCreateError("")
    if (!form.title || !form.dueDate || !form.maxScore) {
      setCreateError("Please fill in all required fields.")
      return
    }
    setCreating(true)
    try {
      const res = await fetch(`${API}/api/courses/${course.id}/assignments`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ ...form, maxScore: Number(form.maxScore), attachmentUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error || "Failed to create."); return }
      setAssignments((prev) => [...prev, {
        id: data.id, title: data.title, description: data.description, type: data.type,
        dueDate: data.dueDate, maxScore: data.maxScore, attachmentUrl: data.attachmentUrl || "",
        userAssignmentId: null, status: "todo", grade: null, feedback: null, submissionText: null, submittedAt: null,
      }])
      setForm({ title: "", description: "", type: "homework", dueDate: "", maxScore: "100" })
      setAttachmentUrl("")
      setActiveView("list")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(assignmentId: string) {
    if (!confirm("Delete this assignment? This will remove all student submissions.")) return
    const res = await fetch(`${API}/api/assignments/${assignmentId}`, { method: "DELETE", credentials: "include" })
    if (res.ok) setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
  }

  if (role === "teacher") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
          <div className="flex gap-2">
            <Button
              variant={activeView === "grading" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView(activeView === "grading" ? "list" : "grading")}
            >
              Grade Submissions {needsGrading.length > 0 && `(${needsGrading.length})`}
            </Button>
            <Button size="sm" onClick={() => setActiveView(activeView === "create" ? "list" : "create")}>
              <Plus className="mr-1 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </div>

        {activeView === "create" && (
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New Assignment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="HW1: Introduction" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="type">Type *</Label>
                  <select id="type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="homework">Assignment</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input id="dueDate" type="datetime-local" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="maxScore">Max Score *</Label>
                  <Input id="maxScore" type="number" min="1" value={form.maxScore} onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))} placeholder="100" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <textarea id="description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="What do students need to do?" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Attachment PDF (optional)</Label>
                <input ref={attachmentInputRef} type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f); e.target.value = "" }} />
                {attachmentUrl ? (
                  <div className="flex items-center gap-2 text-sm">
                    <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" /> View PDF
                    </a>
                    <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setAttachmentUrl("")}>Remove</button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" disabled={attachmentUploading} onClick={() => attachmentInputRef.current?.click()} className="w-fit">
                    {attachmentUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
                    Attach PDF
                  </Button>
                )}
              </div>
              {createError && <p className="text-xs text-destructive">{createError}</p>}
              <div className="flex gap-2">
                <Button size="sm" disabled={creating || attachmentUploading} onClick={handleCreate}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Post Assignment
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveView("list")}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === "grading" ? (
          <div className="flex flex-col gap-2">
            {studentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              studentSubmissions.map((sub) => (
                <GradingRow key={sub.userAssignmentId} sub={sub} onGrade={handleGrade} />
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assignments yet. Create the first one.</p>
            ) : (
              assignments.map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[a.type] ?? "bg-secondary text-secondary-foreground"}`}>
                    {a.type === "homework" ? "assignment" : a.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                    {a.description && <p className="text-xs text-muted-foreground truncate">{a.description}</p>}
                    {a.attachmentUrl && (
                      <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                        <Paperclip className="h-3 w-3" /> PDF attached
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(a.dueDate)}
                    <span>· {a.maxScore} pts</span>
                    <button onClick={() => handleDelete(a.id)} className="ml-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  // Student view
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>{assignments.filter((a) => a.submittedAt).length}/{assignments.length} submitted</span>
          <span>·</span>
          <span>{assignments.filter((a) => a.grade != null).length} graded</span>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming ({upcoming.length})</p>
          {upcoming.map((a) => <AssignmentRow key={a.id} a={a} onSubmit={handleSubmit} onStatusChange={handleStatusChange} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Past ({past.length})</p>
          {past.map((a) => <AssignmentRow key={a.id} a={a} onSubmit={handleSubmit} onStatusChange={handleStatusChange} />)}
        </div>
      )}

      {assignments.length === 0 && (
        <p className="text-sm text-muted-foreground">No assignments posted yet.</p>
      )}
    </div>
  )
}

// ─── Grades Tab ───────────────────────────────────────────────────────────────

function GradesTab({ course, role, assignments, studentSubmissions, setStudentSubmissions }: {
  course: CourseInfo
  role: "student" | "teacher"
  assignments: AssignmentItem[]
  studentSubmissions: StudentSubmission[]
  setStudentSubmissions: React.Dispatch<React.SetStateAction<StudentSubmission[]>>
}) {
  const [editingScheme, setEditingScheme] = useState(false)
  const [schemeInput, setSchemeInput] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(course.gradingScheme).map(([k, v]) => [k, String(v)]))
  )
  const [savingScheme, setSavingScheme] = useState(false)
  const [schemeError, setSchemeError] = useState("")

  const graded = assignments.filter((a) => a.grade != null)

  // Group grades by type
  const byType: Record<string, { grades: number[]; maxes: number[] }> = {}
  for (const a of graded) {
    if (!byType[a.type]) byType[a.type] = { grades: [], maxes: [] }
    byType[a.type].grades.push(a.grade!)
    byType[a.type].maxes.push(a.maxScore)
  }

  const typeAvgs: Record<string, number> = {}
  for (const [type, { grades, maxes }] of Object.entries(byType)) {
    const totalEarned = grades.reduce((s, g) => s + g, 0)
    const totalMax = maxes.reduce((s, m) => s + m, 0)
    typeAvgs[type] = Math.round((totalEarned / totalMax) * 100)
  }

  // Calculate weighted grade if scheme is set
  const schemeEntries = Object.entries(course.gradingScheme)
  let weightedGrade: number | null = null
  if (schemeEntries.length > 0) {
    let totalWeight = 0
    let earned = 0
    for (const [type, weight] of schemeEntries) {
      if (typeAvgs[type] != null) {
        earned += (typeAvgs[type] * weight) / 100
        totalWeight += weight
      }
    }
    if (totalWeight > 0) weightedGrade = Math.round(earned / (totalWeight / 100))
  }

  async function saveScheme() {
    setSchemeError("")
    const scheme: Record<string, number> = {}
    let total = 0
    for (const [k, v] of Object.entries(schemeInput)) {
      if (!v || !k.trim()) continue
      scheme[k.trim()] = Number(v)
      total += Number(v)
    }
    if (total !== 100) { setSchemeError("Weights must sum to 100%."); return }
    setSavingScheme(true)
    const res = await fetch(`${API}/api/courses/${course.id}/grading-scheme`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ scheme }),
    })
    setSavingScheme(false)
    if (res.ok) { course.gradingScheme = scheme; setEditingScheme(false) }
  }

  async function handleGrade(uaId: string, grade: number, feedback: string) {
    const res = await fetch(`${API}/api/userassignments/${uaId}/grade`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ grade, feedback }),
    })
    if (!res.ok) return
    setStudentSubmissions((prev) => prev.map((s) => s.userAssignmentId === uaId ? { ...s, grade, feedback } : s))
  }

  if (role === "teacher") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Grades</h2>
          <Button variant="outline" size="sm" onClick={() => setEditingScheme((v) => !v)}>
            {editingScheme ? "Cancel" : schemeEntries.length > 0 ? "Edit Grading Scheme" : "Set Grading Scheme"}
          </Button>
        </div>

        {editingScheme && (
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Grading Scheme</CardTitle>
              <CardDescription>Set the weight for each assignment type. Must sum to 100%.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["homework", "quiz", "exam", "project", "reading"].map((type) => (
                <div key={type} className="flex items-center gap-3">
                  <Label className="w-24 capitalize text-sm">{type === "homework" ? "Assignment" : type}</Label>
                  <Input
                    type="number" min="0" max="100" className="w-24"
                    value={schemeInput[type] ?? ""}
                    onChange={(e) => setSchemeInput((s) => ({ ...s, [type]: e.target.value }))}
                    placeholder="0"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              ))}
              {schemeError && <p className="text-xs text-destructive">{schemeError}</p>}
              <Button size="sm" disabled={savingScheme} onClick={saveScheme} className="w-fit">
                {savingScheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Scheme
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">All Submissions</p>
          {studentSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            studentSubmissions.map((sub) => (
              <GradingRow key={sub.userAssignmentId} sub={sub} onGrade={handleGrade} />
            ))
          )}
        </div>
      </div>
    )
  }

  // Student view
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground">Grades</h2>

      {weightedGrade != null && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Grade</p>
              <p className="text-3xl font-bold text-foreground mt-1">{letterGrade(weightedGrade)}</p>
            </div>
            <p className="text-2xl font-semibold text-muted-foreground">{weightedGrade}%</p>
          </CardContent>
        </Card>
      )}

      {schemeEntries.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grading Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {schemeEntries.map(([type, weight]) => {
                const avg = typeAvgs[type]
                return (
                  <div key={type} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{type === "homework" ? "Assignment" : type}</p>
                      <p className="text-xs text-muted-foreground">{weight}% of grade</p>
                    </div>
                    <div className="text-right">
                      {avg != null ? (
                        <>
                          <p className="text-sm font-bold text-foreground">{letterGrade(avg)}</p>
                          <p className="text-xs text-muted-foreground">{avg}%</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">No grades</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">All Assignments</p>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignments posted yet.</p>
        ) : (
          assignments.map((a) => {
            const hasGrade = a.grade != null
            const pct = hasGrade ? Math.round((a.grade! / a.maxScore) * 100) : null
            return (
              <div key={a.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLORS[a.type] ?? "bg-secondary text-secondary-foreground"}`}>
                  {a.type === "homework" ? "assignment" : a.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                  {a.feedback && <p className="text-xs text-muted-foreground truncate">{a.feedback}</p>}
                  {!hasGrade && <p className="text-xs text-muted-foreground">Due {formatDate(a.dueDate)}</p>}
                </div>
                <div className="text-right shrink-0">
                  {hasGrade ? (
                    <>
                      <p className="text-sm font-bold text-foreground">{letterGrade(pct!)} · {pct}%</p>
                      <p className="text-xs text-muted-foreground">{a.grade}/{a.maxScore}</p>
                    </>
                  ) : a.submittedAt ? (
                    <span className="text-xs text-blue-600 font-medium">Submitted</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Resources Tab ────────────────────────────────────────────────────────────

function ResourcesTab({ course, role, assignments: allAssignments, announcements: initAnnouncements, files: initFiles }: {
  course: CourseInfo
  role: "student" | "teacher"
  assignments: AssignmentItem[]
  announcements: Announcement[]
  files: CourseFile[]
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initAnnouncements)
  const [files, setFiles] = useState<CourseFile[]>(initFiles)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoaded, setPostsLoaded] = useState(false)

  // Active panel: null = show grid, string = show that panel
  const [activePanel, setActivePanel] = useState<string | null>(null)

  // Announcement form
  const [annTitle, setAnnTitle] = useState("")
  const [annBody, setAnnBody] = useState("")
  const [postingAnn, setPostingAnn] = useState(false)

  // File form
  const [fileName, setFileName] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [fileDesc, setFileDesc] = useState("")
  const [addingFile, setAddingFile] = useState(false)

  // Discussion form
  const [postContent, setPostContent] = useState("")
  const [postAnon, setPostAnon] = useState(false)
  const [postingPost, setPostingPost] = useState(false)

  async function loadPosts() {
    if (postsLoaded) return
    const res = await fetch(`${API}/api/courses/${course.id}/posts`, { credentials: "include" })
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts || [])
    }
    setPostsLoaded(true)
  }

  async function postAnnouncement() {
    if (!annTitle || !annBody) return
    setPostingAnn(true)
    const res = await fetch(`${API}/api/courses/${course.id}/announcements`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ title: annTitle, body: annBody }),
    })
    if (res.ok) {
      const data = await res.json()
      setAnnouncements((prev) => [data, ...prev])
      setAnnTitle(""); setAnnBody("")
    }
    setPostingAnn(false)
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete this announcement?")) return
    const res = await fetch(`${API}/api/announcements/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  async function addFile() {
    if (!fileName || !fileUrl) return
    setAddingFile(true)
    const res = await fetch(`${API}/api/courses/${course.id}/files`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ name: fileName, url: fileUrl, description: fileDesc }),
    })
    if (res.ok) {
      const data = await res.json()
      setFiles((prev) => [data, ...prev])
      setFileName(""); setFileUrl(""); setFileDesc("")
    }
    setAddingFile(false)
  }

  async function deleteFile(id: string) {
    if (!confirm("Remove this file?")) return
    const res = await fetch(`${API}/api/files/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  async function submitPost() {
    if (!postContent.trim()) return
    setPostingPost(true)
    const res = await fetch(`${API}/api/courses/${course.id}/posts`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ content: postContent, isAnonymous: postAnon }),
    })
    if (res.ok) {
      const data = await res.json()
      setPosts((prev) => [data, ...prev])
      setPostContent(""); setPostAnon(false)
    }
    setPostingPost(false)
  }

  async function deletePost(id: string) {
    const res = await fetch(`${API}/api/posts/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const resourceCards = [
    ...(role === "student" ? [{
      id: "studyhub",
      title: "Study Hub",
      description: "Quiz mode, flashcards, AI tutor, and more",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      badge: null as string | null,
      action: () => window.open(`/study?courseId=${course.id}`, "_self"),
      isExternal: true,
    }] : []),
    ...(role === "student" ? [{
      id: "gradecalc",
      title: "Grade Calculator",
      description: "See what grade you need on upcoming work",
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      badge: null as string | null,
      action: () => setActivePanel("gradecalc"),
    }] : []),
    {
      id: "files",
      title: "Course Files",
      description: `${files.length} file${files.length !== 1 ? "s" : ""} from instructor`,
      icon: <Paperclip className="h-5 w-5 text-primary" />,
      badge: files.length > 0 ? String(files.length) : null,
      action: () => setActivePanel("files"),
    },
    {
      id: "announcements",
      title: "Announcements",
      description: `${announcements.length} post${announcements.length !== 1 ? "s" : ""} from instructor`,
      icon: <MessagesSquare className="h-5 w-5 text-primary" />,
      badge: announcements.length > 0 ? String(announcements.length) : null,
      action: () => setActivePanel("announcements"),
    },
    {
      id: "discussion",
      title: "Discussion",
      description: "Ask questions, share thoughts (anon OK)",
      icon: <Send className="h-5 w-5 text-primary" />,
      badge: null,
      action: () => { setActivePanel("discussion"); loadPosts() },
    },
    {
      id: "examdates",
      title: "Quizzes & Exams",
      description: "Upcoming test dates for this course",
      icon: <ClipboardCheck className="h-5 w-5 text-primary" />,
      badge: null,
      action: () => setActivePanel("examdates"),
    },
  ]

  if (activePanel) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => setActivePanel(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit">
          ← Back to Resources
        </button>

        {/* Grade Calculator */}
        {activePanel === "gradecalc" && <GradeCalculator course={course} assignments={allAssignments} />}

        {/* Files */}
        {activePanel === "files" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Course Files</h2>
            {role === "teacher" && (
              <Card className="border-none shadow-sm">
                <CardContent className="pt-4 flex flex-col gap-3">
                  <p className="text-sm font-medium text-foreground">Add a file link</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label>File name *</Label>
                      <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Practice Exam 1" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>URL *</Label>
                      <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Description (optional)</Label>
                    <Input value={fileDesc} onChange={(e) => setFileDesc(e.target.value)} placeholder="Brief note about this file" />
                  </div>
                  <Button size="sm" disabled={addingFile || !fileName || !fileUrl} onClick={addFile} className="w-fit">
                    {addingFile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add File
                  </Button>
                </CardContent>
              </Card>
            )}
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files posted yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {files.map((f) => (
                  <div key={f.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        {f.name} <ExternalLink className="h-3 w-3" />
                      </a>
                      {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                      <p className="text-[11px] text-muted-foreground/60">{f.uploaderName} · {timeAgo(f.createdAt)}</p>
                    </div>
                    {role === "teacher" && (
                      <button onClick={() => deleteFile(f.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Announcements */}
        {activePanel === "announcements" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Announcements</h2>
            {role === "teacher" && (
              <Card className="border-none shadow-sm">
                <CardContent className="pt-4 flex flex-col gap-3">
                  <p className="text-sm font-medium text-foreground">Post an announcement</p>
                  <Input value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Title" />
                  <textarea rows={3} value={annBody} onChange={(e) => setAnnBody(e.target.value)}
                    className="w-full rounded-md border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Write your announcement..." />
                  <Button size="sm" disabled={postingAnn || !annTitle || !annBody} onClick={postAnnouncement} className="w-fit">
                    {postingAnn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Post
                  </Button>
                </CardContent>
              </Card>
            )}
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {announcements.map((a) => (
                  <Card key={a.id} className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground mb-2">{a.authorName} · {timeAgo(a.createdAt)}</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{a.body}</p>
                        </div>
                        {role === "teacher" && (
                          <button onClick={() => deleteAnnouncement(a.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discussion */}
        {activePanel === "discussion" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Discussion</h2>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-4 flex flex-col gap-3">
                <textarea rows={3} value={postContent} onChange={(e) => setPostContent(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ask a question or share something..." />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={postAnon} onChange={(e) => setPostAnon(e.target.checked)} className="rounded" />
                    Post anonymously
                  </label>
                  <Button size="sm" disabled={postingPost || !postContent.trim()} onClick={submitPost}>
                    {postingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet. Be the first!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((p) => (
                  <Card key={p.id} className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">
                            {p.isAnonymous ? "Anonymous" : p.authorName} · {timeAgo(p.createdAt)}
                          </p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{p.content}</p>
                        </div>
                        {(p.isOwn || role === "teacher") && (
                          <button onClick={() => deletePost(p.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exam Dates */}
        {activePanel === "examdates" && <ExamDates course={course} role={role} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground">Resources</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resourceCards.map((card) => (
          <button
            key={card.id}
            onClick={card.action}
            className="text-left rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {card.icon}
              </div>
              {card.badge && (
                <Badge variant="secondary" className="text-xs">{card.badge}</Badge>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">{card.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Grade Calculator ─────────────────────────────────────────────────────────

function GradeCalculator({ course, assignments }: { course: CourseInfo; assignments: AssignmentItem[] }) {
  const schemeEntries = Object.entries(course.gradingScheme)

  // predictions: { [assignmentId]: string } — user-typed value for ungraded items
  const [predictions, setPredictions] = useState<Record<string, string>>({})

  function resetPrediction(id: string) {
    setPredictions((p) => { const n = { ...p }; delete n[id]; return n })
  }

  function resetAll() { setPredictions({}) }

  // For each assignment: effective pct
  // - graded → real grade pct (locked)
  // - prediction entered → prediction value
  // - otherwise → null (excluded)
  function effectivePct(a: AssignmentItem): number | null {
    if (a.grade != null) return Math.round((a.grade / a.maxScore) * 100)
    const p = predictions[a.id]
    if (p === undefined || p === "") return null
    const v = parseFloat(p)
    return isNaN(v) ? null : Math.min(100, Math.max(0, Math.round(v)))
  }

  // Group assignments by type, compute per-type weighted avg from items that have a value
  function calcWeightedGrade(): { grade: number | null; includedTypes: Set<string> } {
    if (schemeEntries.length === 0) return { grade: null, includedTypes: new Set() }

    // Per type: collect (earned, max) for items with a value
    const byType: Record<string, { earned: number; max: number }> = {}
    for (const a of assignments) {
      const pct = effectivePct(a)
      if (pct == null) continue
      if (!byType[a.type]) byType[a.type] = { earned: 0, max: 0 }
      byType[a.type].earned += (pct / 100) * a.maxScore
      byType[a.type].max += a.maxScore
    }

    let totalWeight = 0, earned = 0
    const includedTypes = new Set<string>()
    for (const [type, weight] of schemeEntries) {
      const d = byType[type]
      if (d && d.max > 0) {
        const typePct = (d.earned / d.max) * 100
        earned += (typePct * weight) / 100
        totalWeight += weight
        includedTypes.add(type)
      }
    }

    if (totalWeight === 0) return { grade: null, includedTypes }
    return { grade: Math.round(earned / (totalWeight / 100)), includedTypes }
  }

  const { grade: weightedGrade, includedTypes } = calcWeightedGrade()

  const byType = assignments.reduce<Record<string, AssignmentItem[]>>((acc, a) => {
    if (!acc[a.type]) acc[a.type] = []
    acc[a.type].push(a)
    return acc
  }, {})

  const hasPredictions = Object.keys(predictions).some((k) => predictions[k] !== "")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Grade Calculator</h2>
        {hasPredictions && (
          <Button variant="outline" size="sm" onClick={resetAll}>Reset all predictions</Button>
        )}
      </div>

      {schemeEntries.length === 0 && (
        <p className="text-sm text-muted-foreground">The instructor hasn't set a grading scheme yet.</p>
      )}

      {/* Projected grade summary */}
      {weightedGrade != null && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Projected Grade</p>
              <p className="text-3xl font-bold text-foreground mt-1">{letterGrade(weightedGrade)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {includedTypes.size} categor{includedTypes.size === 1 ? "y" : "ies"}
                {hasPredictions ? " (includes predictions)" : ""}
              </p>
            </div>
            <p className="text-2xl font-semibold text-muted-foreground">{weightedGrade}%</p>
          </CardContent>
        </Card>
      )}

      {/* Per-type breakdown */}
      {assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assignments posted yet.</p>
      ) : (
        schemeEntries.map(([type, weight]) => {
          const items = byType[type] || []
          if (items.length === 0) return null
          return (
            <div key={type} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground capitalize">
                  {type === "homework" ? "Assignments" : type.charAt(0).toUpperCase() + type.slice(1)}s
                </p>
                <span className="text-xs text-muted-foreground">({weight}% of grade)</span>
              </div>
              {items.map((a) => {
                const isGraded = a.grade != null
                const pct = effectivePct(a)
                const predicted = predictions[a.id]
                return (
                  <div key={a.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${TYPE_COLORS[a.type] ?? "bg-secondary text-secondary-foreground"}`}>
                      {a.type === "homework" ? "hw" : a.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.maxScore} pts · due {formatDate(a.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isGraded ? (
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{letterGrade(pct!)} · {pct}%</p>
                          <p className="text-xs text-muted-foreground">{a.grade}/{a.maxScore}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number" min="0" max="100"
                              className="w-16 h-8 text-xs"
                              placeholder="Predict"
                              value={predicted ?? ""}
                              onChange={(e) => setPredictions((p) => ({ ...p, [a.id]: e.target.value }))}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          {predicted !== undefined && predicted !== "" && (
                            <button
                              onClick={() => resetPrediction(a.id)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Reset prediction"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })
      )}

      {/* Items not in any scheme category */}
      {(() => {
        const schemeTypes = new Set(schemeEntries.map(([t]) => t))
        const untracked = assignments.filter((a) => !schemeTypes.has(a.type))
        if (!untracked.length) return null
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-muted-foreground">Other (not in grading scheme)</p>
            {untracked.map((a) => (
              <div key={a.id} className="rounded-lg border border-dashed bg-card/50 p-3 flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${TYPE_COLORS[a.type] ?? "bg-secondary text-secondary-foreground"}`}>
                  {a.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">{a.title}</p>
                </div>
                {a.grade != null && (
                  <p className="text-sm text-muted-foreground shrink-0">
                    {a.grade}/{a.maxScore}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}

// ─── Exam Dates ───────────────────────────────────────────────────────────────

function ExamDates({ course, role }: { course: CourseInfo; role: "student" | "teacher" }) {
  const [assignments, setAssignments] = useState<{ id: string; title: string; type: string; dueDate: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateHint, setShowCreateHint] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/api/courses/${course.id}`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setAssignments((data.assignments || []).filter((a: { type: string }) => a.type === "quiz" || a.type === "exam"))
      }
      setLoading(false)
    }
    load()
  }, [course.id])

  const upcoming = assignments.filter((a) => new Date(a.dueDate) > new Date())
  const past = assignments.filter((a) => new Date(a.dueDate) <= new Date())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Quizzes & Exams</h2>
        {role === "teacher" && (
          <Button size="sm" variant="outline" onClick={() => setShowCreateHint((v) => !v)}>
            Add exam/quiz date →
          </Button>
        )}
      </div>
      {showCreateHint && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          Go to the <strong>Assignments</strong> tab and create an assignment with type "Quiz" or "Exam" to add it here.
        </p>
      )}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : upcoming.length === 0 && past.length === 0 ? (
        <p className="text-sm text-muted-foreground">No quizzes or exams posted yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming</p>
              {upcoming.map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${a.type === "exam" ? "bg-red-100 text-red-700" : "bg-red-100 text-red-700"}`}>
                    {a.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(a.dueDate)}
                    <span className="text-primary font-medium ml-1">{daysUntil(a.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Past</p>
              {past.map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                  <div className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-muted text-muted-foreground">{a.type}</div>
                  <p className="text-sm text-muted-foreground flex-1 truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground shrink-0">{formatDate(a.dueDate)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CoursePageContent({ courseId, activeTab }: { courseId: string; activeTab: string }) {
  const router = useRouter()
  const [course, setCourse] = useState<CourseInfo | null>(null)
  const [assignments, setAssignments] = useState<AssignmentItem[]>([])
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [files, setFiles] = useState<CourseFile[]>([])
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/courses/${courseId}`, { credentials: "include" })
        if (res.status === 401) { router.push("/login"); return }
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        setCourse(data.course)
        setAssignments(data.assignments || [])
        setStudentSubmissions(data.studentSubmissions || [])
        setAnnouncements(data.announcements || [])
        setFiles(data.files || [])
        setRole(data.role || "student")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Back to Courses
        </Link>
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    )
  }

  if (role === "teacher" && activeTab === "overview") {
    return (
      <OverviewTab
        course={course}
        role={role}
        onSyllabusUpdate={(url) => setCourse((c) => c ? { ...c, syllabusUrl: url } : c)}
      />
    )
  }

  if (activeTab === "overview") {
    return (
      <OverviewTab
        course={course}
        role={role}
        onSyllabusUpdate={(url) => setCourse((c) => c ? { ...c, syllabusUrl: url } : c)}
      />
    )
  }

  if (activeTab === "assignments") {
    return (
      <AssignmentsTab
        course={course}
        role={role}
        assignments={assignments}
        setAssignments={setAssignments}
        studentSubmissions={studentSubmissions}
        setStudentSubmissions={setStudentSubmissions}
      />
    )
  }

  if (activeTab === "grades") {
    return (
      <GradesTab
        course={course}
        role={role}
        assignments={assignments}
        studentSubmissions={studentSubmissions}
        setStudentSubmissions={setStudentSubmissions}
      />
    )
  }

  if (activeTab === "resources") {
    return (
      <ResourcesTab
        course={course}
        role={role}
        assignments={assignments}
        announcements={announcements}
        files={files}
      />
    )
  }

  return null
}
