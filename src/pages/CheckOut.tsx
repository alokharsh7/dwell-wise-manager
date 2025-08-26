import { useState } from "react"
import { UserMinus, Calendar, CreditCard, Receipt } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock current guests data
const currentGuests = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    room: "A102",
    checkInDate: "2024-01-15",
    nights: 3,
    pricePerNight: 45,
    email: "john.smith@email.com",
    phone: "+1 555-0123"
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    room: "B205",
    checkInDate: "2024-01-14",
    nights: 4,
    pricePerNight: 75,
    email: "sarah.j@email.com",
    phone: "+1 555-0456"
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Chen",
    room: "C302",
    checkInDate: "2024-01-13",
    nights: 2,
    pricePerNight: 25,
    email: "mike.chen@email.com",
    phone: "+1 555-0789"
  }
]

export default function CheckOut() {
  const [selectedGuest, setSelectedGuest] = useState<typeof currentGuests[0] | null>(null)
  const [checkOutNotes, setCheckOutNotes] = useState("")

  const handleGuestSelect = (guest: typeof currentGuests[0]) => {
    setSelectedGuest(guest)
    setCheckOutNotes("")
  }

  const handleCheckOut = () => {
    if (selectedGuest) {
      console.log("Check-out data:", {
        guest: selectedGuest,
        checkOutDate: new Date().toISOString(),
        notes: checkOutNotes
      })
      // Here you would typically send the data to your backend
      alert(`${selectedGuest.firstName} ${selectedGuest.lastName} has been checked out successfully!`)
      setSelectedGuest(null)
      setCheckOutNotes("")
    }
  }

  const calculateTotal = (guest: typeof currentGuests[0]) => {
    return guest.nights * guest.pricePerNight
  }

  return (
    <Layout title="Guest Check-Out">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Selection */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserMinus className="w-6 h-6 text-primary" />
                Select Guest to Check Out
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentGuests.map((guest) => (
                <div
                  key={guest.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedGuest?.id === guest.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50 hover:bg-primary/2"
                  }`}
                  onClick={() => handleGuestSelect(guest)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-foreground">
                      {guest.firstName} {guest.lastName}
                    </h3>
                    <Badge variant="outline" className="border-success/20 text-success">
                      Room {guest.room}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check-in Date</p>
                      <p className="font-medium">{new Date(guest.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nights Stayed</p>
                      <p className="font-medium">{guest.nights} nights</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-medium">₹{guest.pricePerNight}/night</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-primary">₹{calculateTotal(guest)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {currentGuests.length === 0 && (
                <div className="text-center py-8">
                  <UserMinus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Current Guests</h3>
                  <p className="text-muted-foreground">There are no guests currently checked in.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check-out Summary */}
          {selectedGuest && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-primary" />
                  Check-Out Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Guest Details */}
                <div className="bg-gradient-to-br from-card to-secondary/30 p-4 rounded-lg border border-border/50">
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    {selectedGuest.firstName} {selectedGuest.lastName}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{selectedGuest.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedGuest.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{selectedGuest.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Stay Summary */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Stay Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in Date:</span>
                      <span className="font-medium">{new Date(selectedGuest.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Nights:</span>
                      <span className="font-medium">{selectedGuest.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate per Night:</span>
                      <span className="font-medium">₹{selectedGuest.pricePerNight}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Total Amount:</span>
                      <span className="font-bold text-lg text-primary">₹{calculateTotal(selectedGuest)}</span>
                    </div>
                  </div>
                </div>

                {/* Check-out Notes */}
                <div className="space-y-2">
                  <Label htmlFor="checkOutNotes">Check-out Notes (Optional)</Label>
                  <Textarea
                    id="checkOutNotes"
                    value={checkOutNotes}
                    onChange={(e) => setCheckOutNotes(e.target.value)}
                    placeholder="Any notes about the check-out, room condition, etc."
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedGuest(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCheckOut}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-hover hover:shadow-soft"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Complete Check-Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}