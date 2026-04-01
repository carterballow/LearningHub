"use client"

import {
  Home,
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState<"student" | "teacher">("student")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setUserName(d?.user?.name || "")
        setUserEmail(d?.user?.email || "")
        setUserRole(d?.user?.role || "student")
        setAvatarUrl(d?.user?.avatarUrl || "")
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      router.push("/login")
    }
  }

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?"

  const resolvedAvatar = avatarUrl
    ? avatarUrl.startsWith("/uploads/") ? `${API_BASE}${avatarUrl}` : avatarUrl
    : ""

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/home" className="flex items-center gap-2">
          <img src="/LearningHub.png" alt="LearningHub" className="h-8 w-8 rounded-md object-cover shrink-0" />
          <span className="text-sm font-extrabold tracking-widest uppercase text-sidebar-primary-foreground [font-family:var(--font-display)] group-data-[collapsible=icon]:hidden">
            LearningHub
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/home"} tooltip="Home" className="py-3 min-h-[44px]">
                <Link href="/home" className="flex items-center gap-3">
                  <Home className="h-6 w-6" />
                  <span className="text-base font-semibold">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/profile"} tooltip="Profile" className="py-3 min-h-[44px]">
                <Link href="/profile" className="flex items-center gap-3">
                  <User className="h-6 w-6" />
                  <span className="font-semibold">Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/courses")} tooltip="Courses" className="py-3 min-h-[44px]">
                <Link href="/courses" className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="font-semibold">
                    {userRole === "teacher" ? "My Courses" : "Courses"}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/calendar"} tooltip="Calendar" className="py-3 min-h-[44px]">
                <Link href="/calendar" className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <span className="font-semibold">Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={userName} size="lg">
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-7 w-7 shrink-0">
                  {resolvedAvatar && <AvatarImage src={resolvedAvatar} alt={userName} />}
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left text-xs leading-tight gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sidebar-primary-foreground truncate max-w-[100px]">
                      {userName || "Loading…"}
                    </span>
                    {userRole === "teacher" && (
                      <Badge className="bg-purple-500 text-white text-[9px] px-1 py-0 leading-none shrink-0">
                        TEACHER
                      </Badge>
                    )}
                  </div>
                  <span className="text-sidebar-foreground/60 truncate max-w-[120px]">{userEmail}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
