// ProfilePage.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfilePage } from '../pages/ProfilePage';

describe('ProfilePage', () => {
  it('adds a new date to the "Save the Dates" list', () => {
    const { getByPlaceholderText, getByText } = render(<ProfilePage />);
    const dateInput = getByPlaceholderText('Enter date');
    const addButton = getByText('Add');
    fireEvent.changeText(dateInput, '2025-09-30');
    fireEvent.press(addButton);
    expect(getByText('2025-09-30')).toBeTruthy();
  });
});
