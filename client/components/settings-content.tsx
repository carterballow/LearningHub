"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Palette,
  Mail,
  Bell,
  Shield,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Contrast,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const THEME_COLORS = [
  { id: "teal",   label: "Teal",   cls: "bg-[hsl(173,58%,39%)]" },
  { id: "blue",   label: "Blue",   cls: "bg-[hsl(220,70%,50%)]" },
  { id: "purple", label: "Purple", cls: "bg-[hsl(258,60%,54%)]" },
  { id: "rose",   label: "Rose",   cls: "bg-[hsl(340,75%,52%)]" },
  { id: "green",  label: "Green",  cls: "bg-[hsl(142,55%,38%)]" },
  { id: "orange", label: "Orange", cls: "bg-[hsl(25,90%,48%)]"  },
]

const MODES = [
  { id: 0, label: "Light",  Icon: Sun     },
  { id: 1, label: "System", Icon: Monitor },
  { id: 2, label: "Dark",   Icon: Moon    },
]

function applyMode(modeIdx: number) {
  const root = document.documentElement
  if (modeIdx === 0) root.classList.remove("dark")
  else if (modeIdx === 2) root.classList.add("dark")
  else {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? root.classList.add("dark")
      : root.classList.remove("dark")
  }
}

function applyColor(colorId: string) {
  const root = document.documentElement
  THEME_COLORS.forEach((c) => root.classList.remove(`theme-${c.id}`))
  if (colorId !== "teal") root.classList.add(`theme-${colorId}`)
}

function applyHighContrast(on: boolean) {
  on
    ? document.documentElement.classList.add("high-contrast")
    : document.documentElement.classList.remove("high-contrast")
}

export function SettingsContent() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState("")
  const [selectedMode, setSelectedMode] = useState(1)
  const [selectedColor, setSelectedColor] = useState("teal")
  const [highContrast, setHighContrast] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [deletionRequested, setDeletionRequested] = useState(false)
  const [deletionConfirm, setDeletionConfirm] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [passwordMessage, setPasswordMessage] = useState("")

  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem("lh-theme-mode")
    if (savedMode !== null) setSelectedMode(Number(savedMode))

    const savedColor = localStorage.getItem("lh-theme-color") || "teal"
    setSelectedColor(savedColor)

    const savedHC = localStorage.getItem("lh-high-contrast") === "true"
    setHighContrast(savedHC)

    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setUserEmail(d?.user?.email || "")
        setEmailNotifications(d?.user?.emailNotifications || false)
        setDeletionRequested(d?.user?.deletionRequested || false)
        // Sync server preferences to local
        if (d?.user?.themeColor) {
          setSelectedColor(d.user.themeColor)
          applyColor(d.user.themeColor)
          localStorage.setItem("lh-theme-color", d.user.themeColor)
        }
        if (d?.user?.highContrast !== undefined) {
          setHighContrast(d.user.highContrast)
          applyHighContrast(d.user.highContrast)
          localStorage.setItem("lh-high-contrast", String(d.user.highContrast))
        }
      })
      .catch(() => {})
  }, [])

  function handleModeChange(idx: number) {
    setSelectedMode(idx)
    applyMode(idx)
    localStorage.setItem("lh-theme-mode", String(idx))
  }

  function handleColorChange(colorId: string) {
    setSelectedColor(colorId)
    applyColor(colorId)
    localStorage.setItem("lh-theme-color", colorId)
    savePrefs({ themeColor: colorId })
  }

  function handleHighContrastChange(on: boolean) {
    setHighContrast(on)
    applyHighContrast(on)
    localStorage.setItem("lh-high-contrast", String(on))
    savePrefs({ highContrast: on })
  }

  function handleEmailNotificationsChange(on: boolean) {
    setEmailNotifications(on)
    savePrefs({ emailNotifications: on })
  }

  async function savePrefs(patch: Record<string, unknown>) {
    await fetch(`${API_BASE}/api/preferences`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {})
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordMessage("Please fill in both fields.")
      setPasswordStatus("error")
      return
    }
    setPasswordStatus("loading")
    setPasswordMessage("")
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPasswordStatus("error")
        setPasswordMessage(data?.error || "Password change failed.")
      } else {
        setPasswordStatus("success")
        setPasswordMessage("Password updated successfully.")
        setCurrentPassword("")
        setNewPassword("")
        setTimeout(() => { setShowPasswordForm(false); setPasswordStatus("idle"); setPasswordMessage("") }, 2000)
      }
    } catch {
      setPasswordStatus("error")
      setPasswordMessage("Network error. Please try again.")
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {})
    router.push("/login")
  }

  const handleRequestDeletion = async () => {
    const res = await fetch(`${API_BASE}/api/account/request-deletion`, {
      method: "POST",
      credentials: "include",
    })
    if (res.ok) setDeletionRequested(true)
    setDeletionConfirm(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Appearance */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Appearance</CardTitle>
              <CardDescription>Theme color, display mode, and accessibility</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Color picker */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Accent Color</p>
            <div className="flex flex-wrap gap-3">
              {THEME_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleColorChange(c.id)}
                  title={c.label}
                  className={`relative h-10 w-10 rounded-full transition-all ${c.cls} ${
                    selectedColor === c.id
                      ? "ring-2 ring-offset-2 ring-foreground scale-110"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                >
                  {selectedColor === c.id && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Selected: {THEME_COLORS.find((c) => c.id === selectedColor)?.label ?? "Teal"}
            </p>
          </div>

          <Separator />

          {/* Mode picker */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Display Mode</p>
            <div className="flex gap-3">
              {MODES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleModeChange(id)}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    selectedMode === id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${selectedMode === id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${selectedMode === id ? "text-primary" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* High contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">High Contrast</p>
                <p className="text-xs text-muted-foreground">Increases contrast for better readability</p>
              </div>
            </div>
            <Switch checked={highContrast} onCheckedChange={handleHighContrastChange} />
          </div>
        </CardContent>
      </Card>

      {/* Email */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
              <Mail className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-foreground">Account Email</CardTitle>
              <CardDescription>Your university account email address</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Primary Email
              <Badge variant="secondary" className="text-[10px]">University</Badge>
            </Label>
            <Input value={userEmail} readOnly className="bg-muted/50" />
            <p className="text-[11px] text-muted-foreground">Primary email is managed by your university account</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-foreground">Notifications</CardTitle>
              <CardDescription>Opt into email notifications from your courses</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Get emailed when teachers post announcements, new assignments, or grades
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={handleEmailNotificationsChange} />
          </div>
          {emailNotifications && (
            <p className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              Emails will be sent to {userEmail || "your university email"}.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-foreground">Security & Account</CardTitle>
              <CardDescription>Password, sessions, and account management</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Change password */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setShowPasswordForm((v) => !v)
                setPasswordStatus("idle")
                setPasswordMessage("")
                setCurrentPassword("")
                setNewPassword("")
              }}>
                {showPasswordForm ? "Cancel" : "Update"}
              </Button>
            </div>

            {showPasswordForm && (
              <div className="rounded-lg border border-border bg-secondary/30 p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="current-password" className="text-sm">Current Password</Label>
                  <div className="relative">
                    <Input id="current-password" type={showCurrent ? "text" : "password"}
                      value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password" className="pr-10" />
                    <button type="button" onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-password" className="text-sm">New Password</Label>
                  <div className="relative">
                    <Input id="new-password" type={showNew ? "text" : "password"}
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (8+ chars)" className="pr-10" />
                    <button type="button" onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {passwordMessage && (
                  <p className={`text-xs ${passwordStatus === "success" ? "text-primary" : "text-destructive"}`}>
                    {passwordMessage}
                  </p>
                )}
                <Button onClick={handleChangePassword} disabled={passwordStatus === "loading"} size="sm" className="w-fit">
                  {passwordStatus === "loading" ? "Saving…" : "Save Password"}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Log out */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Log Out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>

          <Separator />

          {/* Delete account */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  {deletionRequested
                    ? "Your deletion request has been submitted. An admin will review it."
                    : "Sends a deletion request to an admin. Your account won't be deleted automatically."}
                </p>
              </div>
              {!deletionRequested && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => setDeletionConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Request Deletion
                </Button>
              )}
              {deletionRequested && (
                <Badge variant="secondary" className="text-destructive border border-destructive/30">Pending Review</Badge>
              )}
            </div>

            {deletionConfirm && (
              <div className="rounded-md border border-destructive/30 bg-background p-3 flex flex-col gap-2">
                <p className="text-sm font-medium text-destructive">Are you sure?</p>
                <p className="text-xs text-muted-foreground">
                  An email will be sent to the admin. Your account will only be deleted if approved.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={handleRequestDeletion}>Yes, request deletion</Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeletionConfirm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
