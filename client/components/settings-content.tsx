"use client"

import { useState } from "react"
import {
  Palette,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  LogOut,
  Check,
  MessageSquare,
  Sun,
  Moon,
  Monitor,
  Github,
  Linkedin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const themeColors = [
  { name: "Teal", class: "bg-primary" },
  { name: "Blue", class: "bg-chart-3" },
  { name: "Orange", class: "bg-accent" },
  { name: "Rose", class: "bg-chart-5" },
  { name: "Green", class: "bg-[hsl(142,55%,40%)]" },
  { name: "Indigo", class: "bg-[hsl(245,58%,51%)]" },
]

const appearanceModes = [
  { name: "Light", icon: Sun },
  { name: "System", icon: Monitor },
  { name: "Dark", icon: Moon },
]

export function SettingsContent() {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedMode, setSelectedMode] = useState(0)
  const [notifyAssignments, setNotifyAssignments] = useState(true)
  const [notifyGrades, setNotifyGrades] = useState(true)
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(true)
  const [notifyMessages, setNotifyMessages] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Appearance: Theme Color + Mode */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Appearance</CardTitle>
              <CardDescription>Customize theme color and display mode</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Accent Color</p>
              <div className="flex flex-wrap gap-3">
                {themeColors.map((color, index) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(index)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${color.class} ${
                      selectedColor === index
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105"
                    }`}
                    aria-label={`Select ${color.name} theme`}
                  >
                    {selectedColor === index && (
                      <Check className="h-5 w-5 text-card" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Selected: {themeColors[selectedColor].name}
              </p>
            </div>

            <Separator />

            {/* Display Mode */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Display Mode</p>
              <div className="flex gap-3">
                {appearanceModes.map((mode, index) => (
                  <button
                    key={mode.name}
                    type="button"
                    onClick={() => setSelectedMode(index)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      selectedMode === index
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <mode.icon className={`h-5 w-5 ${selectedMode === index ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${selectedMode === index ? "text-primary" : "text-muted-foreground"}`}>
                      {mode.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
              <MessageSquare className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-foreground">Contact Methods</CardTitle>
              <CardDescription>Manage your contact information and social accounts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Primary Email
                  <Badge variant="secondary" className="text-[10px]">University</Badge>
                </span>
              </Label>
              <Input
                id="email"
                defaultValue="alex@university.edu"
                className="bg-muted/50"
                readOnly
              />
              <p className="text-[11px] text-muted-foreground">
                Primary email is managed by your university account
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="alt-email" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Personal Email
                </span>
              </Label>
              <Input
                id="alt-email"
                defaultValue="alex.johnson@gmail.com"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </span>
              </Label>
              <Input
                id="phone"
                defaultValue="(555) 123-4567"
                className="bg-card"
              />
            </div>

            <Separator />

            <p className="text-sm font-medium text-foreground">Social & Messaging</p>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discord" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Discord
                </span>
              </Label>
              <Input
                id="discord"
                defaultValue="alexj#1234"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="github" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  GitHub
                </span>
              </Label>
              <Input
                id="github"
                defaultValue="alexjohnson"
                placeholder="Your GitHub username"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedin" className="text-sm text-foreground">
                <span className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  LinkedIn
                </span>
              </Label>
              <Input
                id="linkedin"
                defaultValue="alex-johnson-cs"
                placeholder="Your LinkedIn profile slug"
                className="bg-card"
              />
            </div>

            <Button className="w-fit bg-primary text-primary-foreground">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-foreground">Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Assignment Reminders</p>
                <p className="text-xs text-muted-foreground">Get reminded before assignments are due</p>
              </div>
              <Switch checked={notifyAssignments} onCheckedChange={setNotifyAssignments} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Grade Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified when grades are posted</p>
              </div>
              <Switch checked={notifyGrades} onCheckedChange={setNotifyGrades} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Announcements</p>
                <p className="text-xs text-muted-foreground">Receive course and school announcements</p>
              </div>
              <Switch checked={notifyAnnouncements} onCheckedChange={setNotifyAnnouncements} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Direct Messages</p>
                <p className="text-xs text-muted-foreground">Notifications for new messages from classmates</p>
              </div>
              <Switch checked={notifyMessages} onCheckedChange={setNotifyMessages} />
            </div>
            <Separator />

            <p className="text-sm font-medium text-foreground mt-1">Delivery Methods</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Send notifications to your email</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">Send urgent notifications via text message</p>
              </div>
              <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Logout */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-foreground">Security & Account</CardTitle>
              <CardDescription>Account security, sessions, and logout</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Manage devices logged into your account</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Download My Data</p>
                <p className="text-xs text-muted-foreground">Export all your account data</p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <Separator />
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
                </div>
                <Button variant="destructive" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
