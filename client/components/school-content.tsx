"use client"

import {
  School,
  MapPin,
  Phone,
  Globe,
  Users,
  BookOpen,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const departments = [
  { name: "Computer Science", faculty: 24, courses: 45 },
  { name: "Mathematics", faculty: 18, courses: 32 },
  { name: "Chemistry", faculty: 15, courses: 28 },
  { name: "English", faculty: 20, courses: 35 },
  { name: "History", faculty: 12, courses: 22 },
  { name: "Physics", faculty: 16, courses: 30 },
]

const quickLinks = [
  { title: "Student Portal", url: "#" },
  { title: "Library Catalog", url: "#" },
  { title: "Academic Calendar", url: "#" },
  { title: "Financial Aid", url: "#" },
  { title: "Campus Map", url: "#" },
  { title: "IT Help Desk", url: "#" },
]

export function SchoolContent() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">School</h2>
        <p className="text-muted-foreground mt-1">University information and resources</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* School Info */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Westfield University</CardTitle>
                <CardDescription>Established 1892</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">1200 University Ave, Westfield, CA 94102</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">(555) 000-1234</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">www.westfield.edu</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">12K</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">850</p>
                  <p className="text-xs text-muted-foreground">Faculty</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">200+</p>
                  <p className="text-xs text-muted-foreground">Programs</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">95%</p>
                  <p className="text-xs text-muted-foreground">Job Rate</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Departments</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {departments.map((dept) => (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.faculty} faculty - {dept.courses} courses
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Links</CardTitle>
            <CardDescription>Useful university resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                >
                  <span className="text-sm font-medium text-foreground">{link.title}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
