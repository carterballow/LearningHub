"use client"

import { useState } from "react"
import {
  FolderOpen,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Download,
  Upload,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const files = [
  {
    id: 1,
    name: "CS101_Lecture_Notes_Week5.pdf",
    course: "CS 101",
    type: "pdf",
    size: "2.4 MB",
    uploaded: "Feb 6, 2026",
    icon: FileText,
    color: "text-destructive",
  },
  {
    id: 2,
    name: "MATH201_Problem_Set_5.pdf",
    course: "MATH 201",
    type: "pdf",
    size: "1.1 MB",
    uploaded: "Feb 5, 2026",
    icon: FileText,
    color: "text-destructive",
  },
  {
    id: 3,
    name: "CHEM202_Lab_Report_Template.docx",
    course: "CHEM 202",
    type: "doc",
    size: "458 KB",
    uploaded: "Feb 4, 2026",
    icon: FileText,
    color: "text-chart-3",
  },
  {
    id: 4,
    name: "ENG301_Research_Paper_Draft.docx",
    course: "ENG 301",
    type: "doc",
    size: "3.2 MB",
    uploaded: "Feb 3, 2026",
    icon: FileText,
    color: "text-chart-3",
  },
  {
    id: 5,
    name: "CS210_BST_Diagram.png",
    course: "CS 210",
    type: "image",
    size: "856 KB",
    uploaded: "Feb 2, 2026",
    icon: FileImage,
    color: "text-primary",
  },
  {
    id: 6,
    name: "HIST150_Timeline_Spreadsheet.xlsx",
    course: "HIST 150",
    type: "spreadsheet",
    size: "1.8 MB",
    uploaded: "Feb 1, 2026",
    icon: FileSpreadsheet,
    color: "text-accent",
  },
  {
    id: 7,
    name: "CS101_Project_Files.zip",
    course: "CS 101",
    type: "archive",
    size: "15.4 MB",
    uploaded: "Jan 30, 2026",
    icon: FileArchive,
    color: "text-muted-foreground",
  },
  {
    id: 8,
    name: "MATH201_Formula_Sheet.pdf",
    course: "MATH 201",
    type: "pdf",
    size: "320 KB",
    uploaded: "Jan 28, 2026",
    icon: FileText,
    color: "text-destructive",
  },
]

const folders = [
  { name: "CS 101", count: 12, color: "bg-primary/10 text-primary" },
  { name: "MATH 201", count: 8, color: "bg-chart-3/10 text-chart-3" },
  { name: "CHEM 202", count: 6, color: "bg-destructive/10 text-destructive" },
  { name: "ENG 301", count: 5, color: "bg-accent/10 text-accent" },
  { name: "CS 210", count: 9, color: "bg-primary/10 text-primary" },
  { name: "HIST 150", count: 4, color: "bg-chart-3/10 text-chart-3" },
]

export function FilesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.course.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Files</h2>
          <p className="text-muted-foreground mt-1">
            {files.length} files across {folders.length} courses
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Folders */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Course Folders</h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {folders.map((folder) => (
            <button
              key={folder.name}
              type="button"
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/50"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${folder.color.split(" ")[0]}`}>
                <FolderOpen className={`h-5 w-5 ${folder.color.split(" ")[1]}`} />
              </div>
              <span className="text-xs font-medium text-foreground">{folder.name}</span>
              <span className="text-[10px] text-muted-foreground">{folder.count} files</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center rounded-md border bg-card">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
      </div>

      {/* File List */}
      {viewMode === "list" ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
                >
                  <file.icon className={`h-5 w-5 shrink-0 ${file.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {file.course} - {file.uploaded}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {file.size}
                  </Badge>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Download {file.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <file.icon className={`h-5 w-5 ${file.color}`} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{file.course}</span>
                  <span>{file.size}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
