"use client"

import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Edit3,
  LogOut,
  BookOpen,
  Clock,
  Globe,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

const academicInfo = {
  gpa: "3.72",
  credits: 68,
  totalCredits: 120,
  major: "Computer Science",
  minor: "Mathematics",
  year: "Junior",
  advisor: "Dr. Margaret Wilson",
  enrollmentDate: "Fall 2023",
}

const achievements = [
  { title: "Dean's List", description: "Fall 2025", type: "academic" },
  { title: "Perfect Attendance", description: "CS 101", type: "attendance" },
  { title: "Top Quiz Score", description: "CHEM 202 - Quiz 3", type: "quiz" },
  { title: "Study Streak", description: "15 day streak", type: "study" },
]

const enrolledCourses = [
  { code: "CS 101", name: "Intro to Computer Science", grade: "A", initials: "CS", color: "bg-primary" },
  { code: "MATH 201", name: "Linear Algebra", grade: "B+", initials: "MA", color: "bg-chart-3" },
  { code: "CHEM 202", name: "Organic Chemistry", grade: "B", initials: "CH", color: "bg-destructive" },
  { code: "ENG 301", name: "English Composition", grade: "A-", initials: "EN", color: "bg-accent" },
  { code: "CS 210", name: "Data Structures", grade: "A", initials: "DS", color: "bg-primary" },
  { code: "HIST 150", name: "World History", grade: "A-", initials: "HI", color: "bg-chart-3" },
]

export function ProfileContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="destructive" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  AJ
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold text-foreground">Alex Johnson</h3>
              <p className="text-sm text-muted-foreground">Student ID: STU-2023-4521</p>
              <Badge className="mt-2 bg-primary text-primary-foreground">{academicInfo.year}</Badge>

              <Separator className="my-4 w-full" />

              <div className="flex w-full flex-col gap-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">alex@university.edu</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">alex.johnson@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Discord: alexj#1234</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Dorm Hall C, Room 302</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{academicInfo.major}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">Enrolled: {academicInfo.enrollmentDate}</span>
                </div>
              </div>

              <Separator className="my-4 w-full" />

              <Link href="/settings" className="w-full">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Shield className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Academic Info + Achievements */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Academic Information</CardTitle>
            <CardDescription>Your academic progress and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{academicInfo.gpa}</p>
                  <p className="text-xs text-muted-foreground mt-1">out of 4.0</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Major</p>
                  <p className="text-sm font-medium text-foreground mt-1">{academicInfo.major}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minor</p>
                  <p className="text-sm font-medium text-foreground mt-1">{academicInfo.minor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Advisor</p>
                  <p className="text-sm font-medium text-foreground mt-1">{academicInfo.advisor}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Credit Progress</span>
                    <span className="font-medium text-foreground">
                      {academicInfo.credits}/{academicInfo.totalCredits}
                    </span>
                  </div>
                  <Progress
                    value={(academicInfo.credits / academicInfo.totalCredits) * 100}
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {academicInfo.totalCredits - academicInfo.credits} credits remaining
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Achievements</p>
                  <div className="flex flex-col gap-2">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.title}
                        className="flex items-center gap-3 rounded-lg bg-secondary/50 p-2.5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                          <GraduationCap className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{achievement.title}</p>
                          <p className="text-[11px] text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Enrolled Courses</CardTitle>
              <CardDescription>Spring 2026 Semester</CardDescription>
            </div>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.code}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-secondary/50"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className={`${course.color} text-card text-xs font-bold`}>
                    {course.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{course.code}</p>
                  <p className="text-xs text-muted-foreground truncate">{course.name}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">{course.grade}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription>Your recent account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {[
              { action: "Submitted assignment", detail: "Linear Algebra Problem Set 5", time: "2 hours ago", icon: BookOpen },
              { action: "Completed quiz", detail: "CS 101 - Weekly Quiz 5", time: "Yesterday", icon: GraduationCap },
              { action: "Updated notes", detail: "Binary Search Trees - Implementation", time: "Yesterday", icon: Edit3 },
              { action: "Uploaded file", detail: "CS101_Lecture_Notes_Week5.pdf", time: "2 days ago", icon: BookOpen },
              { action: "Logged in from new device", detail: "Chrome on MacOS", time: "3 days ago", icon: Shield },
            ].map((activity) => (
              <div
                key={`${activity.action}-${activity.time}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
