import { render, fireEvent } from "@testing-library/react-native";
import "@testing-library/jest-dom";
import { EventModal } from "./EventModal";
import { Event } from '../../types';

const mockEvent = {
  id: '1',
  name: 'Jazz Night',
  date: '2025-10-01',
  city: 'Downtown Club',
  category: 'Music',
};

describe("EventModal", () => {
  
  it("renders event details correctly", () => {
    const { getByText } = render(<EventModal event={mockEvent} onClose={() => {}} />);

    expect(getByText('Jazz Night')).toBeTruthy();
    expect(getByText('Date: 2025-09-25')).toBeTruthy();
    expect(getByText('City: San Francisco')).toBeTruthy();
    expect(getByText('Venue: TBD')).toBeTruthy();
    expect(getByText('Performers: TBD')).toBeTruthy();
    expect(getByText('Ticket URL: TBD')).toBeTruthy();
  });

  it('calls onClose when the close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(<EventModal event={mockEvent} onClose={onCloseMock} />);

    const closeButton = getByText('✖');
    fireEvent.press(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
