export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  contact: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessInput {
  name: string;
  description: string;
  category: string;
  location: string;
  contact: string;
  image_url: string;
}
