import { useState } from "react"
import { UserPlus, Calendar, Phone, IdCard, Bed } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Mock available rooms
const availableRooms = [
  { id: 1, number: "A101", type: "Single", price: 45, capacity: 1 },
  { id: 2, number: "A103", type: "Single", price: 45, capacity: 1 },
  { id: 3, number: "B201", type: "Double", price: 75, capacity: 2 },
  { id: 4, number: "B203", type: "Double", price: 75, capacity: 2 },
  { id: 5, number: "C301", type: "Dorm", price: 25, capacity: 6 },
]

export default function CheckIn() {
  const [selectedRoom, setSelectedRoom] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    checkInDate: new Date().toISOString().split('T')[0],
    notes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckIn = () => {
    console.log("Check-in data:", { ...formData, roomId: selectedRoom })
    // Here you would typically send the data to your backend
    alert("Guest checked in successfully!")
  }

  return (
    <Layout title="Guest Check-In">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              New Guest Check-In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="guest@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber" className="flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    ID Number
                  </Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    placeholder="Driver's license or passport"
                  />
                </div>
                <div>
                  <Label htmlFor="checkInDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Check-In Date
                  </Label>
                  <Input
                    id="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => handleInputChange("checkInDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional notes about the guest..."
                  rows={3}
                />
              </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Room Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedRoom === room.id.toString()
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/50 hover:bg-primary/2"
                    }`}
                    onClick={() => setSelectedRoom(room.id.toString())}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Bed className="w-4 h-4 text-primary" />
                        Room {room.number}
                      </h4>
                      {selectedRoom === room.id.toString() && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Type:</span> {room.type}</p>
                      <p><span className="text-muted-foreground">Capacity:</span> {room.capacity} beds</p>
                      <p><span className="text-muted-foreground">Price:</span> <span className="font-medium">₹{room.price}/night</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCheckIn}
                disabled={!selectedRoom || !formData.firstName || !formData.lastName || !formData.phone}
                className="flex-1 bg-gradient-to-r from-primary to-primary-hover hover:shadow-soft"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Complete Check-In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}