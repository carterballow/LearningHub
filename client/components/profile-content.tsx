"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Mail,
  Edit3,
  LogOut,
  Plus,
  Shield,
  TrendingUp,
  User as UserIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type User = {
  name: string
  email: string
  role?: string
  bio?: string
  avatarUrl?: string
}

type GradeEntry = {
  title: string
  type: string
  grade: number
  maxScore: number
  pct: number
}

type GradeCourse = {
  code: string
  title: string
  color: string
  avg: number | null
  grades: GradeEntry[]
}

type GradesSummary = {
  courses: GradeCourse[]
  overall: number | null
}

function letterGrade(pct: number): string {
  if (pct >= 97) return "A+"
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  if (pct >= 70) return "C-"
  if (pct >= 67) return "D+"
  if (pct >= 63) return "D"
  if (pct >= 60) return "D-"
  return "F"
}

export function ProfileContent() {
  const [user, setUser] = useState<User | null>(null)
  const [gradesSummary, setGradesSummary] = useState<GradesSummary | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [bioInput, setBioInput] = useState("")
  const [avatarInput, setAvatarInput] = useState("")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const opts: RequestInit = { credentials: "include" }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, opts)
        if (!res.ok) return
        const data = await res.json()
        const u = data.user ?? data
        if (u?.name) {
          setUser(u)
          setNameInput(u.name || "")
          setBioInput(u.bio || "")
          setAvatarInput(u.avatarUrl || "")
        }
      } catch (err) {
        console.error("User fetch failed", err)
      }
    }

    const fetchGrades = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/grades/summary`, opts)
        if (!res.ok) return
        const data = await res.json()
        setGradesSummary(data)
      } catch (err) {
        console.error("Grades fetch failed", err)
      }
    }

    fetchUser()
    fetchGrades()
  }, [])

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
    window.location.href = "/login"
  }

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    const form = new FormData()
    form.append("avatar", file)
    try {
      const res = await fetch(`${API_BASE}/api/upload/avatar`, {
        method: "POST",
        credentials: "include",
        body: form,
      })
      if (res.ok) {
        const data = await res.json()
        const url = data.url?.startsWith("/uploads/")
          ? `${API_BASE}${data.url}`
          : data.url
        setAvatarInput(url)
        setUser((prev) => prev ? { ...prev, avatarUrl: url } : prev)
      }
    } catch {
      setSaveError("Avatar upload failed.")
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleSave = async () => {
    setSaveError("")
    setSaveSuccess(false)
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, bio: bioInput, avatarUrl: avatarInput }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError(err?.error || "Failed to save.")
        return
      }
      const data = await res.json()
      setUser((prev) => prev ? { ...prev, name: data.name, bio: data.bio, avatarUrl: data.avatarUrl } : prev)
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setSaveError("Network error. Please try again.")
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  const roleLabel = user?.role === "teacher" ? "Teacher" : "Student"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => { setIsEditing(true); setSaveError(""); setSaveSuccess(false) }}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          Profile updated successfully.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  {(avatarInput || user?.avatarUrl) ? (
                    <AvatarImage src={avatarInput || user?.avatarUrl} alt={user?.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    title="Upload photo"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleAvatarUpload(f)
                    e.target.value = ""
                  }}
                />
              </div>

              {isEditing ? (
                <div className="w-full flex flex-col gap-3">
                  {avatarUploading && <p className="text-xs text-muted-foreground text-center">Uploading photo…</p>}

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs text-muted-foreground font-medium">Display Name</label>
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs text-muted-foreground font-medium">Bio</label>
                    <Textarea
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>

                  {saveError && <p className="text-xs text-destructive text-left">{saveError}</p>}

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                      setIsEditing(false)
                      setNameInput(user?.name || "")
                      setBioInput(user?.bio || "")
                      setAvatarInput(user?.avatarUrl || "")
                      setSaveError("")
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-foreground">{user?.name ?? "Loading..."}</h3>
                  <Badge className="mt-2 bg-primary text-primary-foreground">{roleLabel}</Badge>

                  {user?.bio && (
                    <p className="mt-3 text-sm text-muted-foreground text-center leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  <Separator className="my-4 w-full" />

                  <div className="flex w-full flex-col gap-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-foreground break-all">{user?.email ?? "Loading..."}</span>
                    </div>
                    {user?.role && (
                      <div className="flex items-center gap-3 text-sm">
                        <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{roleLabel}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4 w-full" />

                  <Link href="/settings" className="w-full">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Shield className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {user?.role !== "teacher" && <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Grades</CardTitle>
                <CardDescription>Your performance across all courses</CardDescription>
              </div>
              {gradesSummary?.overall != null && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                  <span className="text-sm font-medium text-foreground">
                    Overall: {letterGrade(gradesSummary.overall)} ({Math.round(gradesSummary.overall)}%)
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!gradesSummary ? (
              <p className="text-sm text-muted-foreground">Loading grades...</p>
            ) : !gradesSummary.courses || gradesSummary.courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grades yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {gradesSummary.courses.map((course) => (
                  <div
                    key={course.code}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{course.code}</p>
                        <p className="text-xs text-muted-foreground truncate">{course.title}</p>
                      </div>
                      <div className="text-right">
                        {course.avg != null ? (
                          <>
                            <p className="text-lg font-bold text-foreground">{letterGrade(course.avg)}</p>
                            <p className="text-xs text-muted-foreground">{Math.round(course.avg)}%</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">N/A</p>
                        )}
                      </div>
                    </div>
                    {course.grades && course.grades.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {course.grades.slice(0, 3).map((g, idx) => (
                          <div key={`${g.title}-${idx}`} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate max-w-[140px]">{g.title}</span>
                            <span className="text-foreground font-medium shrink-0 ml-2">
                              {g.grade}/{g.maxScore}
                            </span>
                          </div>
                        ))}
                        {course.grades.length > 3 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            +{course.grades.length - 3} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>}
      </div>
    </div>
  )
}
