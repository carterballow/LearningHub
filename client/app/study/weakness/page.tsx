"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Target } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type TypeStat = {
  type: string
  avg: number
  count: number
  items: { title: string; pct: number; grade: number; maxScore: number }[]
}

type CourseStat = {
  code: string
  title: string
  color?: string
  avg: number
  count: number
}

function pctColor(pct: number) {
  if (pct >= 90) return "text-green-600"
  if (pct >= 75) return "text-blue-600"
  if (pct >= 60) return "text-yellow-600"
  return "text-red-600"
}

function barColor(pct: number) {
  if (pct >= 90) return "bg-green-500"
  if (pct >= 75) return "bg-blue-500"
  if (pct >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

function letterGrade(pct: number) {
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  if (pct >= 70) return "C-"
  return "D"
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function WeaknessContent() {
  const router = useRouter()
  const [data, setData] = useState<{ gradedCount: number; typeStats: TypeStat[]; courseStats: CourseStat[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/api/study/weakness`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null }
        return r.json()
      })
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const noData = !data?.gradedCount

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/study" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Study Hub
        </Link>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Weakness Tracker
        </h2>
      </div>

      {noData ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 text-center">
            <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No graded work yet</p>
            <p className="text-xs text-muted-foreground">
              Once your teacher grades some assignments, your performance breakdown will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Based on {data!.gradedCount} graded assignment{data!.gradedCount !== 1 ? "s" : ""}. Areas are sorted from weakest to strongest.
          </p>

          {/* By assignment type */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">By Assignment Type</h3>
            <div className="flex flex-col gap-3">
              {data!.typeStats.map((ts) => (
                <Card key={ts.type} className="border-none shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left"
                    onClick={() => setExpanded(expanded === ts.type ? null : ts.type)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground">{capitalize(ts.type)}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${pctColor(ts.avg)}`}>{ts.avg}%</span>
                            <Badge variant="secondary" className="text-[10px]">{letterGrade(ts.avg)}</Badge>
                            <span className="text-xs text-muted-foreground">{ts.count} graded</span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${barColor(ts.avg)}`}
                            style={{ width: `${ts.avg}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </button>

                  {/* Expanded items */}
                  {expanded === ts.type && (
                    <div className="border-t px-4 pb-4 pt-3 flex flex-col gap-2">
                      {ts.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground truncate max-w-[60%]">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${pctColor(item.pct)}`}>{item.pct}%</span>
                            <span className="text-xs text-muted-foreground">({item.grade}/{item.maxScore})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* By course */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">By Course</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {data!.courseStats.map((cs) => (
                <Card key={cs.code} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{cs.code}</p>
                        <p className="text-xs text-muted-foreground">{cs.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${pctColor(cs.avg)}`}>{cs.avg}%</span>
                        <Badge variant="secondary" className="text-xs">{letterGrade(cs.avg)}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${barColor(cs.avg)}`}
                        style={{ width: `${cs.avg}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{cs.count} graded assignment{cs.count !== 1 ? "s" : ""}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Weakest area highlight */}
          {data!.typeStats.length > 0 && data!.typeStats[0].avg < 75 && (
            <Card className="border-none shadow-sm border-l-4 border-l-red-400">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Focus area: {capitalize(data!.typeStats[0].type)}s
                </p>
                <p className="text-sm text-muted-foreground">
                  Your average on {data!.typeStats[0].type}s is {data!.typeStats[0].avg}%. Ask the AI Tutor to help you review the material.
                </p>
                <Link href="/study/ai">
                  <button className="mt-3 text-xs font-medium text-primary hover:underline">
                    Open AI Tutor →
                  </button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default function WeaknessPage() {
  return (
    <DashboardLayout title="Weakness Tracker">
      <WeaknessContent />
    </DashboardLayout>
  )
}
