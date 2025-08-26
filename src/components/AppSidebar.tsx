import { Home, Bed, UserPlus, UserMinus, Users, Building, Shield, LogOut } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Rooms", url: "/rooms", icon: Bed },
  { title: "Check In", url: "/check-in", icon: UserPlus },
  { title: "Check Out", url: "/check-out", icon: UserMinus },
  { title: "Guests", url: "/guests", icon: Users },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { profile, signOut } = useAuth()
  const currentPath = location.pathname

  const handleSignOut = async () => {
    await signOut()
  }

  const isActive = (path: string) => currentPath === path || (path !== "/" && currentPath.startsWith(path))
  const isExpanded = navigationItems.some((item) => isActive(item.url))

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-md" 
      : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className={state === "collapsed" ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hostel-blue to-hostel-purple rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            {state === "expanded" && (
              <div>
                <h2 className="font-bold text-lg text-foreground">DwellWise</h2>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {state === "expanded" && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state === "expanded" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {profile?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {state === "expanded" && "Administration"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to="/admin"
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200`}
                    >
                      <Shield className="h-5 w-5 flex-shrink-0" />
                      {state === "expanded" && <span className="font-medium">Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bottom section */}
        <div className="p-4 border-t border-border space-y-2">
          {state === "expanded" && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
          <SidebarTrigger className="w-full justify-center" />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}