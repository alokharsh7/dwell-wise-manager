import { useState, useRef, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from "lucide-react"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { SearchBar } from "@/components/SearchBar"

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                {title && (
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div ref={searchRef} className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => {
                      setShowSearch(!showSearch)
                      setShowNotifications(false)
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <SearchBar 
                    isOpen={showSearch} 
                    onClose={() => setShowSearch(false)} 
                  />
                </div>
                
                <div ref={notificationRef} className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      setShowSearch(false)
                    }}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                  </Button>
                  <NotificationDropdown 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)} 
                  />
                </div>
                
                <Button variant="ghost" size="icon" asChild>
                  <a href="/profile">
                    <User className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}