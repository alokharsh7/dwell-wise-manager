import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Bed } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const roomSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  room_type: z.enum(["Single", "Double", "Dorm"]),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price_per_night: z.number().min(0, "Price must be positive"),
  status: z.enum(["Available", "Occupied", "Maintenance"]).default("Available"),
  amenities: z.array(z.string()).default([]),
  guest_name: z.string().optional(),
  description: z.string().optional(),
})

type Room = {
  id: string
  room_number: string
  room_type: string
  capacity: number
  price_per_night: number
  status: string
  amenities: string[]
  guest_name?: string
  description?: string
}

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const { toast } = useToast()

  const addForm = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      room_type: "Single" as const,
      capacity: 1,
      price_per_night: 0,
      status: "Available" as const,
      amenities: [],
      guest_name: "",
      description: "",
    }
  })

  const editForm = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      room_type: "Single" as const,
      capacity: 1,
      price_per_night: 0,
      status: "Available" as const,
      amenities: [],
      guest_name: "",
      description: "",
    }
  })

  // Fetch rooms from Supabase
  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      })
    }
  }

  // Add new room
  const addRoom = async (data: z.infer<typeof roomSchema>) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .insert([data])

      if (error) throw error

      toast({
        title: "Success",
        description: "Room added successfully",
      })
      
      setIsAddDialogOpen(false)
      addForm.reset()
      fetchRooms()
    } catch (error) {
      console.error('Error adding room:', error)
      toast({
        title: "Error",
        description: "Failed to add room",
        variant: "destructive",
      })
    }
  }

  // Update room
  const updateRoom = async (data: z.infer<typeof roomSchema>) => {
    if (!editingRoom) return

    try {
      const { error } = await supabase
        .from('rooms')
        .update(data)
        .eq('id', editingRoom.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Room updated successfully",
      })
      
      setIsEditDialogOpen(false)
      setEditingRoom(null)
      editForm.reset()
      fetchRooms()
    } catch (error) {
      console.error('Error updating room:', error)
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      })
    }
  }

  // Delete room
  const deleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Room deleted successfully",
      })
      
      fetchRooms()
    } catch (error) {
      console.error('Error deleting room:', error)
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      })
    }
  }

  // Handle edit room
  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    editForm.reset({
      room_number: room.room_number,
      room_type: room.room_type as "Single" | "Double" | "Dorm",
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      status: room.status as "Available" | "Occupied" | "Maintenance",
      amenities: room.amenities,
      guest_name: room.guest_name || "",
      description: room.description || "",
    })
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "All" || room.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-success/10 text-success border-success/20"
      case "Occupied":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "Maintenance":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <Layout title="Room Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Room Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-soft">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(addRoom)} className="space-y-4 py-4">
                  <FormField
                    control={addForm.control}
                    name="room_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., A101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="room_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Double">Double</SelectItem>
                            <SelectItem value="Dorm">Dorm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Number of beds"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="price_per_night"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Night</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Add Room
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(updateRoom)} className="space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="room_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Dorm">Dorm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Occupied">Occupied</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Number of beds"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="price_per_night"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="guest_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Guest name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Update Room
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    Room {room.room_number}
                  </CardTitle>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{room.room_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium">{room.capacity} beds</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">₹{room.price_per_night}/night</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Guest</p>
                    <p className="font-medium">{room.guest_name || "None"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditRoom(room)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteRoom(room.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}