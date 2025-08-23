-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('Single', 'Double', 'Dorm')),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  guest_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing public access for now since no auth is implemented)
CREATE POLICY "Anyone can view rooms" 
ON public.rooms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create rooms" 
ON public.rooms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update rooms" 
ON public.rooms 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete rooms" 
ON public.rooms 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.rooms (room_number, room_type, capacity, price_per_night, status, amenities, guest_name) VALUES
('A101', 'Single', 1, 45.00, 'Available', ARRAY['WiFi', 'AC'], NULL),
('A102', 'Single', 1, 45.00, 'Occupied', ARRAY['WiFi', 'AC'], 'John Smith'),
('B201', 'Double', 2, 75.00, 'Available', ARRAY['WiFi', 'AC', 'TV'], NULL),
('B202', 'Double', 2, 75.00, 'Maintenance', ARRAY['WiFi', 'AC', 'TV'], NULL),
('C301', 'Dorm', 6, 25.00, 'Available', ARRAY['WiFi', 'Lockers'], NULL);