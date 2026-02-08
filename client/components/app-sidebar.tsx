"use client"

import {
  Home,
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

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

const API_BASE = "http://localhost:4000"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            LearnHub
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          {/* Home */}
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

          {/* Profile */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/profile"} tooltip="Profile" className="py-3 min-h-[44px]">
                <Link href="/profile" className="flex items-center gap-3">
                  <User className="h-6 w-6"/>
                  <span className="font-semibold">Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Courses */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/courses"} tooltip="Courses" className="py-3 min-h-[44px]">
                <Link href="/courses" className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6"/>
                  <span className="font-semibold">Courses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Calendar */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/calendar"} tooltip="Calendar" className="py-3 min-h-[44px]">
                <Link href="/calendar" className="flex items-center gap-3">
                  <Calendar className="h-6 w-6"/>
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
            <SidebarMenuButton tooltip="Alex Johnson" size="lg">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder.svg" alt="Alex Johnson" />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  AJ
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left text-xs leading-tight">
                <span className="font-semibold text-sidebar-primary-foreground">Alex Johnson</span>
                <span className="text-sidebar-foreground/60">alex@university.edu</span>
              </div>
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
