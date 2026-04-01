"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, BookOpen, FileText, User, X } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const API_BASE = "http://localhost:4000"

type SearchResult = {
  courses: { id: string; code: string; title: string; instructor: string }[]
  assignments: { id: string; title: string; type: string; courseCode: string; courseId: string; dueDate: string }[]
  people: { id: string; name: string; email: string; role: string }[]
}

type Notification = {
  id: string
  type: string
  courseCode: string
  courseName: string
  title: string
  body: string
  read: boolean
  createdAt: string
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

export function TopHeader({ title }: { title: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [showNotifs, setShowNotifs] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Load notifications
  useEffect(() => {
    function loadNotifs() {
      fetch(`${API_BASE}/api/notifications`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          setNotifications(d.notifications || [])
          setUnread(d.unreadCount || 0)
        })
        .catch(() => {})
    }
    loadNotifs()
    const id = setInterval(loadNotifs, 30000) // refresh every 30s
    return () => clearInterval(id)
  }, [])

  // Search debounce
  useEffect(() => {
    if (!query || query.length < 2) { setResults(null); return }
    const t = setTimeout(async () => {
      setSearching(true)
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { credentials: "include" })
      if (res.ok) setResults(await res.json())
      setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false); setQuery(""); setResults(null)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  async function markAllRead() {
    await fetch(`${API_BASE}/api/notifications/read-all`, { method: "PATCH", credentials: "include" })
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }

  const hasResults = results && (results.courses.length > 0 || results.assignments.length > 0 || results.people.length > 0)

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search courses, assignments, people..."
            className="w-64 pl-9 h-9 bg-secondary"
            value={query}
            onFocus={() => setShowSearch(true)}
            onChange={(e) => { setQuery(e.target.value); setShowSearch(true) }}
          />
          {query && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => { setQuery(""); setResults(null) }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Search dropdown */}
          {showSearch && query.length >= 2 && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              {searching && <p className="text-xs text-muted-foreground p-3">Searching…</p>}
              {!searching && !hasResults && query.length >= 2 && (
                <p className="text-xs text-muted-foreground p-3">No results for "{query}"</p>
              )}
              {!searching && hasResults && (
                <div className="flex flex-col max-h-80 overflow-y-auto">
                  {results!.courses.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-3 pt-2 pb-1">Courses</p>
                      {results!.courses.map((c) => (
                        <button key={c.id} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary text-left"
                          onClick={() => { router.push(`/courses/${c.id}`); setShowSearch(false); setQuery("") }}>
                          <BookOpen className="h-4 w-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{c.code}: {c.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.instructor}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results!.assignments.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-3 pt-2 pb-1">Assignments</p>
                      {results!.assignments.map((a) => (
                        <button key={a.id} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary text-left"
                          onClick={() => { router.push(`/courses/${a.courseId}?tab=assignments`); setShowSearch(false); setQuery("") }}>
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                            <p className="text-xs text-muted-foreground">{a.courseCode} · {a.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results!.people.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-3 pt-2 pb-1">People</p>
                      {results!.people.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 px-3 py-2">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{p.email} · {p.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => {
              setShowNotifs((v) => !v)
              if (!showNotifs && unread > 0) markAllRead()
            }}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {showNotifs && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                {notifications.some((n) => !n.read) && (
                  <button className="text-xs text-primary hover:underline" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-3 py-2.5 border-b last:border-0 ${n.read ? "" : "bg-primary/5"}`}>
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${n.read ? "bg-muted" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">{n.courseCode}</p>
                          <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                          {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                          <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
