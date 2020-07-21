import React from 'react';
import { render } from '@testing-library/react';
import { Modal } from './Modal';

test('renders a title and content', () => {
  const { getByText } = render(<Modal title="hello world" open>goodbye</Modal>);
  expect(getByText('hello world')).toBeInTheDocument();
  expect(getByText('goodbye')).toBeInTheDocument();
});

test('does not render when closed', () => {
  const { queryByText } = render(<Modal title="hello world">goodbye</Modal>);
  expect(queryByText('hello world')).not.toBeInTheDocument();
});
