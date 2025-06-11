import api from "../lib/api";
import { Event, EventInput, EventsResponse } from "../types/event";

export const eventService = {
  /**
   * Get all events with optional filtering
   */
  async getAll(params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<EventsResponse> {
    try {
      const response = await api.get("/event", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  /**
   * Get an event by ID
   */
  async getById(id: number): Promise<Event> {
    try {
      const response = await api.get(`/event/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new event
   */
  async create(data: EventInput): Promise<Event> {
    try {
      const response = await api.post("/event", data);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  /**
   * Update an existing event
   */
  async update(id: number, data: Partial<EventInput>): Promise<Event> {
    try {
      const response = await api.put(`/event/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an event
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/event/${id}`);
    } catch (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload an image for an event
   */
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/event/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading event image:", error);
      throw error;
    }
  },

  /**
   * Get upcoming events
   */
  async getUpcoming(limit: number = 4): Promise<Event[]> {
    try {
      const response = await api.get("/event/upcoming", {
        params: { limit },
      });
      return response.data.events;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },
};
