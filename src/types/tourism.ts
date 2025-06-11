export interface TourismImage {
  id: number;
  tourism_id: number;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface TourismDestination {
  id: number;
  name: string;
  description: string;
  location: string;
  category: string;
  image_url: string; // For backward compatibility
  featured: boolean;
  created_at: string;
  updated_at: string;
  images?: TourismImage[]; // Array of images
}

export interface TourismDestinationInput {
  name: string;
  description?: string;
  location?: string;
  category?: string;
  image_url?: string;
  featured?: boolean;
}

// ...other interfaces...
