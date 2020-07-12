import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders settings button', () => {
  const { getByText } = render(<App />);
  const settingsBtn = getByText(/settings/i);
  expect(settingsBtn).toBeInTheDocument();
});
