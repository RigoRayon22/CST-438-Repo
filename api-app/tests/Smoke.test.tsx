import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Smoke test', () => {
  it('renders a text element', () => {
    const { getByText } = render(<Text>Hello world</Text>);
    expect(getByText('Hello world')).toBeTruthy();
  });
});
