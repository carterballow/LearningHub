"use client"

import { useState } from "react"
import {
  StickyNote,
  Plus,
  Search,
  Clock,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const notes = [
  {
    id: 1,
    title: "Binary Search Trees - Implementation",
    course: "CS 210",
    content: "BST property: for every node, left subtree values < node value < right subtree values. Insertion: O(h) where h is height. Balanced BST: O(log n). Deletion cases: leaf, one child, two children...",
    updated: "2 hours ago",
    color: "border-l-primary",
  },
  {
    id: 2,
    title: "Eigenvalues & Eigenvectors",
    course: "MATH 201",
    content: "Av = lambda*v where A is a square matrix, v is an eigenvector, lambda is an eigenvalue. To find: solve det(A - lambda*I) = 0, which gives characteristic polynomial...",
    updated: "Yesterday",
    color: "border-l-chart-3",
  },
  {
    id: 3,
    title: "Organic Reactions - SN1 vs SN2",
    course: "CHEM 202",
    content: "SN1: unimolecular, two steps, carbocation intermediate, racemization. SN2: bimolecular, one step, backside attack, inversion of configuration. SN1 favored by tertiary carbons...",
    updated: "Yesterday",
    color: "border-l-destructive",
  },
  {
    id: 4,
    title: "Rhetoric in Digital Media",
    course: "ENG 301",
    content: "Ethos, pathos, logos in online communication. Social media amplifies emotional appeals. Credibility established differently in digital contexts. Consider audience, platform constraints...",
    updated: "2 days ago",
    color: "border-l-accent",
  },
  {
    id: 5,
    title: "Sorting Algorithms Comparison",
    course: "CS 101",
    content: "Bubble Sort: O(n^2), stable. Merge Sort: O(n log n), stable, extra space. Quick Sort: O(n log n) avg, O(n^2) worst, in-place. Heap Sort: O(n log n), in-place, not stable...",
    updated: "3 days ago",
    color: "border-l-primary",
  },
  {
    id: 6,
    title: "Industrial Revolution Key Events",
    course: "HIST 150",
    content: "1760-1840: First Industrial Revolution. Steam engine (Watt, 1769). Spinning Jenny (1764). Factory system replaced cottage industry. Urbanization accelerated. Social impacts: child labor...",
    updated: "4 days ago",
    color: "border-l-chart-3",
  },
  {
    id: 7,
    title: "Graph Algorithms - BFS & DFS",
    course: "CS 210",
    content: "BFS: uses queue, level-order traversal, finds shortest path in unweighted graph. DFS: uses stack (or recursion), explores as far as possible before backtracking. Both O(V+E)...",
    updated: "5 days ago",
    color: "border-l-primary",
  },
  {
    id: 8,
    title: "Matrix Decomposition Methods",
    course: "MATH 201",
    content: "LU decomposition: A = LU where L is lower triangular, U is upper triangular. QR decomposition: A = QR where Q is orthogonal, R is upper triangular. SVD: A = U*Sigma*V^T...",
    updated: "1 week ago",
    color: "border-l-chart-3",
  },
]

export function NotesContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notes</h2>
          <p className="text-muted-foreground mt-1">{notes.length} notes across all courses</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes by title, course, or content..."
          className="pl-10 bg-card"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            className={`border-none shadow-sm border-l-4 ${note.color} cursor-pointer transition-shadow hover:shadow-md`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="text-xs mb-1">
                  {note.course}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{note.updated}</span>
                </div>
              </div>
              <CardTitle className="text-sm text-foreground leading-tight">
                {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {note.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
            <StickyNote className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No notes found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  )
}
