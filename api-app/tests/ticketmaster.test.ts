import { searchEvents, getEventDetails } from '../src/api/ticketmaster';

global.fetch = jest.fn();

describe('Ticketmaster API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('searchEvents returns events when API call succeeds', async () => {
    const mockEvents = [{ id: '1', name: 'Concert A' }, { id: '2', name: 'Concert B' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _embedded: { events: mockEvents } }),
    });

    const events = await searchEvents('rock');
    expect(events).toEqual(mockEvents);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('getEventDetails throws an error when API call fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Event not found',
    });

    await expect(getEventDetails('bad-id')).rejects.toThrow(
      'Ticketmaster getEventDetails failed: 404 Not Found Event not found'
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
