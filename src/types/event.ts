export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface EventInput {
  name: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  image_url?: string;
}

export interface EventsResponse {
  events: Event[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
