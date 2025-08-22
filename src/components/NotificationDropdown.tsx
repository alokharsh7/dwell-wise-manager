import { useState } from "react"
import { Bell, X, UserCheck, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock notification data
const notifications = [
  {
    id: 1,
    type: "checkin",
    title: "New Check-in",
    message: "John Smith checked into Room A101",
    time: "5 minutes ago",
    unread: true
  },
  {
    id: 2,
    type: "checkout",
    title: "Upcoming Check-out",
    message: "Alice Brown (Room A203) checking out tomorrow",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    type: "alert",
    title: "Room Maintenance",
    message: "Room B205 needs maintenance check",
    time: "2 hours ago",
    unread: false
  },
  {
    id: 4,
    type: "checkin",
    title: "Check-in Completed",
    message: "Sarah Johnson successfully checked into Room B205",
    time: "3 hours ago",
    unread: false
  }
]

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notificationList, setNotificationList] = useState(notifications)
  const unreadCount = notificationList.filter(n => n.unread).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'checkin': return <UserCheck className="w-4 h-4 text-success" />
      case 'checkout': return <Clock className="w-4 h-4 text-warning" />
      case 'alert': return <AlertCircle className="w-4 h-4 text-destructive" />
      default: return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(n => ({ ...n, unread: false }))
    )
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full right-0 mt-2 w-80 z-50">
      <Card className="shadow-elevated border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                  notification.unread ? 'bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {notificationList.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}