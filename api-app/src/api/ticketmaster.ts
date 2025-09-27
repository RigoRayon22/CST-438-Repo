import { Event, EventsSearchResponse } from '../../types';

const API_KEY = process.env.EXPO_PUBLIC_TM_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_TM_BASE_URL;

if (!API_KEY || !BASE_URL) {
  // throw at runtime so you see the error early when testing
  throw new Error('Ticketmaster API_KEY or BASE_URL not set. Make sure .env has EXPO_PUBLIC_TM_API_KEY and EXPO_PUBLIC_TM_BASE_URL');
}

export async function searchEvents(keyword: string): Promise<Event[]> {
  const url = `${BASE_URL}/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(keyword)}&size=20`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ticketmaster search failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data: EventsSearchResponse = await res.json();
  return data._embedded?.events ?? [];
}

export async function getEventDetails(id: string): Promise<Event | null> {
  const url = `${BASE_URL}/events/${encodeURIComponent(id)}.json?apikey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ticketmaster getEventDetails failed: ${res.status} ${res.statusText} ${text}`);
  }

  const event: Event = await res.json();
  return event ?? null;
}
