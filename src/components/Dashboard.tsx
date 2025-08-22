import { Bed, Users, UserCheck, Clock } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - in real app this would come from your database
const dashboardData = {
  totalRooms: 45,
  availableRooms: 12,
  occupiedRooms: 33,
  totalGuests: 67,
  recentCheckins: [
    { id: 1, guestName: "John Smith", room: "A101", checkInTime: "2 hours ago", phone: "+1 555-0123" },
    { id: 2, guestName: "Sarah Johnson", room: "B205", checkInTime: "4 hours ago", phone: "+1 555-0456" },
    { id: 3, guestName: "Mike Chen", room: "C302", checkInTime: "6 hours ago", phone: "+1 555-0789" },
  ],
  upcomingCheckouts: [
    { id: 1, guestName: "Alice Brown", room: "A203", checkOutTime: "Tomorrow 11:00 AM" },
    { id: 2, guestName: "David Wilson", room: "B104", checkOutTime: "Tomorrow 2:00 PM" },
  ]
}

export function Dashboard() {
  const occupancyRate = Math.round((dashboardData.occupiedRooms / dashboardData.totalRooms) * 100)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={dashboardData.totalRooms}
          icon={Bed}
          variant="default"
        />
        <StatCard
          title="Available Rooms"
          value={dashboardData.availableRooms}
          icon={Bed}
          variant="success"
          trend={{ value: 5, label: "from yesterday", isPositive: true }}
        />
        <StatCard
          title="Occupied Rooms"
          value={dashboardData.occupiedRooms}
          icon={UserCheck}
          variant="accent"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={Users}
          variant="warning"
          trend={{ value: 2, label: "from last week", isPositive: true }}
        />
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Check-ins */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-success" />
              Recent Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentCheckins.map((checkin) => (
                <div key={checkin.id} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/10">
                  <div>
                    <p className="font-medium text-foreground">{checkin.guestName}</p>
                    <p className="text-sm text-muted-foreground">{checkin.phone}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-success/20 text-success">
                      Room {checkin.room}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{checkin.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Check-outs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Upcoming Check-outs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingCheckouts.map((checkout) => (
                <div key={checkout.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <div>
                    <p className="font-medium text-foreground">{checkout.guestName}</p>
                    <p className="text-sm text-muted-foreground">Room {checkout.room}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-warning/20 text-warning">
                      {checkout.checkOutTime}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 hover:shadow-soft transition-all duration-200">
              <UserCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-foreground">New Check-in</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/20 border border-accent/20 hover:shadow-soft transition-all duration-200">
              <Clock className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium text-foreground">Process Check-out</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-hostel-green/10 to-hostel-green/20 border border-hostel-green/20 hover:shadow-soft transition-all duration-200">
              <Bed className="w-6 h-6 text-hostel-green" />
              <span className="text-sm font-medium text-foreground">Add Room</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-hostel-purple/10 to-hostel-purple/20 border border-hostel-purple/20 hover:shadow-soft transition-all duration-200">
              <Users className="w-6 h-6 text-hostel-purple" />
              <span className="text-sm font-medium text-foreground">View Guests</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}