import { useState, useEffect, useRef } from "react"
import { Search, X, User, Bed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock search data
const searchData = [
  { id: 1, type: 'guest', name: 'John Smith', room: 'A101', phone: '+1 555-0123' },
  { id: 2, type: 'guest', name: 'Sarah Johnson', room: 'B205', phone: '+1 555-0456' },
  { id: 3, type: 'guest', name: 'Mike Chen', room: 'C302', phone: '+1 555-0789' },
  { id: 4, type: 'guest', name: 'Alice Brown', room: 'A203', phone: '+1 555-0101' },
  { id: 5, type: 'room', name: 'Room A101', status: 'occupied', guest: 'John Smith' },
  { id: 6, type: 'room', name: 'Room A102', status: 'available', guest: null },
  { id: 7, type: 'room', name: 'Room B205', status: 'occupied', guest: 'Sarah Johnson' },
  { id: 8, type: 'room', name: 'Room C301', status: 'available', guest: null },
]

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof searchData>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.type === 'guest' && (
          item.room.toLowerCase().includes(query.toLowerCase()) ||
          item.phone.includes(query)
        )) ||
        (item.type === 'room' && (
          item.status.toLowerCase().includes(query.toLowerCase()) ||
          (item.guest && item.guest.toLowerCase().includes(query.toLowerCase()))
        ))
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  const getIcon = (type: string) => {
    return type === 'guest' ? (
      <User className="w-4 h-4 text-primary" />
    ) : (
      <Bed className="w-4 h-4 text-accent" />
    )
  }

  const getStatusBadge = (item: any) => {
    if (item.type === 'room') {
      return (
        <Badge 
          variant={item.status === 'available' ? 'outline' : 'secondary'}
          className={item.status === 'available' ? 'border-success text-success' : 'border-warning text-warning'}
        >
          {item.status}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-primary/20 text-primary">
        {item.room}
      </Badge>
    )
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <Card className="shadow-elevated border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search guests, rooms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {query.trim() && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(item.type)}
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {item.name}
                        </p>
                        {item.type === 'guest' && (
                          <p className="text-xs text-muted-foreground">{item.phone}</p>
                        )}
                        {item.type === 'room' && item.guest && (
                          <p className="text-xs text-muted-foreground">Guest: {item.guest}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(item)}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Start typing to search guests and rooms...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}