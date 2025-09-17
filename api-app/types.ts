// Centralized TypeScript definitions to keep our data models consistent across the app
export interface Event {
  id: string;
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: { name: string; city: { name: string } }[];
    attractions?: { name: string }[];
  };
  classifications?: { segment?: { name: string } }[];
  url?: string;
}

// For search results
export interface EventsSearchResponse {
  _embedded?: {
    events: Event[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
