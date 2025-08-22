import { useState } from "react"
import { Search, Filter, Users, Calendar, Phone, Mail } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock guest data
const mockGuests = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0123",
    room: "A102",
    checkInDate: "2024-01-15",
    checkOutDate: null,
    status: "Checked In",
    idNumber: "DL123456789",
    nights: 3
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+1 555-0456",
    room: "B205",
    checkInDate: "2024-01-14",
    checkOutDate: null,
    status: "Checked In",
    idNumber: "PP987654321",
    nights: 4
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@email.com",
    phone: "+1 555-0789",
    room: "C302",
    checkInDate: "2024-01-10",
    checkOutDate: "2024-01-13",
    status: "Checked Out",
    idNumber: "DL456789123",
    nights: 3
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@email.com",
    phone: "+1 555-0321",
    room: "A203",
    checkInDate: "2024-01-12",
    checkOutDate: "2024-01-16",
    status: "Checked Out",
    idNumber: "PP123789456",
    nights: 4
  },
]

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const currentGuests = mockGuests.filter(guest => guest.status === "Checked In")
  const guestHistory = mockGuests.filter(guest => guest.status === "Checked Out")

  const filterGuests = (guests: typeof mockGuests) => {
    return guests.filter(guest => {
      const matchesSearch = 
        guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm) ||
        (guest.room && guest.room.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFilter = filterStatus === "All" || guest.status === filterStatus
      
      return matchesSearch && matchesFilter
    })
  }

  const getStatusColor = (status: string) => {
    return status === "Checked In" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted/10 text-muted-foreground border-muted/20"
  }

  const GuestCard = ({ guest }: { guest: typeof mockGuests[0] }) => (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {guest.firstName} {guest.lastName}
            </h3>
            <Badge className={getStatusColor(guest.status)}>
              {guest.status}
            </Badge>
          </div>
          {guest.room && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-semibold text-primary">{guest.room}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{guest.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{guest.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              Check-in: {new Date(guest.checkInDate).toLocaleDateString()}
            </span>
          </div>
          {guest.checkOutDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                Check-out: {new Date(guest.checkOutDate).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID Number:</span>
              <span className="font-medium">{guest.idNumber}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total Nights:</span>
              <span className="font-medium">{guest.nights}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Layout title="Guest Management">
      <div className="space-y-6">
        {/* Header with Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Guests</SelectItem>
              <SelectItem value="Checked In">Currently Checked In</SelectItem>
              <SelectItem value="Checked Out">Guest History</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Current vs History */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Current Guests ({currentGuests.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              History ({guestHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGuests(currentGuests).map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
            {filterGuests(currentGuests).length === 0 && (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Current Guests</h3>
                  <p className="text-muted-foreground">No guests match your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGuests(guestHistory).map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
            {filterGuests(guestHistory).length === 0 && (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Guest History</h3>
                  <p className="text-muted-foreground">No past guests match your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}