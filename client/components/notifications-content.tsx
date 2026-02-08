"use client"

import { useState } from "react"
import {
  Bell,
  FileText,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Notification = {
  id: number
  title: string
  message: string
  time: string
  type: "assignment" | "quiz" | "announcement" | "grade" | "message"
  read: boolean
  course?: string
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Assignment Due Tomorrow",
    message: "Linear Algebra Problem Set 5 is due tomorrow at 11:59 PM.",
    time: "1 hour ago",
    type: "assignment",
    read: false,
    course: "MATH 201",
  },
  {
    id: 2,
    title: "New Quiz Available",
    message: "Midterm Quiz for Organic Chemistry has been posted. Available Feb 11.",
    time: "3 hours ago",
    type: "quiz",
    read: false,
    course: "CHEM 202",
  },
  {
    id: 3,
    title: "Grade Posted",
    message: "Your Chemistry Lab Write-up has been graded. Score: 47/50.",
    time: "5 hours ago",
    type: "grade",
    read: false,
    course: "CHEM 202",
  },
  {
    id: 4,
    title: "Library Extended Hours",
    message: "Library will be open until midnight during midterm week (Feb 10-14).",
    time: "8 hours ago",
    type: "announcement",
    read: true,
  },
  {
    id: 5,
    title: "Office Hours Changed",
    message: "Prof. Williams moved office hours to Thursday 3-5pm this week only.",
    time: "12 hours ago",
    type: "message",
    read: true,
    course: "CS 101",
  },
  {
    id: 6,
    title: "Assignment Graded",
    message: "Reading Response 4 has been graded. Score: 23/25.",
    time: "1 day ago",
    type: "grade",
    read: true,
    course: "ENG 301",
  },
  {
    id: 7,
    title: "New Study Group",
    message: "A new study group for CS 210 has been created. Join in Library Room 5.",
    time: "2 days ago",
    type: "message",
    read: true,
    course: "CS 210",
  },
  {
    id: 8,
    title: "Spring Break Schedule",
    message: "Spring break begins March 16. No classes will be held March 16-20.",
    time: "2 days ago",
    type: "announcement",
    read: true,
  },
]

function getNotificationIcon(type: string) {
  switch (type) {
    case "assignment":
      return <FileText className="h-5 w-5 text-accent" />
    case "quiz":
      return <HelpCircle className="h-5 w-5 text-destructive" />
    case "grade":
      return <CheckCircle2 className="h-5 w-5 text-primary" />
    case "announcement":
      return <AlertCircle className="h-5 w-5 text-chart-3" />
    case "message":
      return <MessageSquare className="h-5 w-5 text-muted-foreground" />
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />
  }
}

export function NotificationsContent() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          <p className="text-muted-foreground mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 transition-colors hover:bg-secondary/50 ${
                  !notification.read ? "bg-primary/[0.02]" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleRead(notification.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") toggleRead(notification.id)
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium ${
                        !notification.read ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    {notification.course && (
                      <Badge variant="secondary" className="text-[10px]">
                        {notification.course}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Delete notification</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">All caught up</p>
          <p className="text-xs text-muted-foreground mt-1">
            No notifications at the moment
          </p>
        </div>
      )}
    </div>
  )
}
