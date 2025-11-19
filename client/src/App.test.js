// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthContext } from './contexts/AuthContext';

test('renders learn react link', () => {
  const mockAuth = {
    user: { id: '1', name: 'Test User' },
    logout: jest.fn(),
  };

  render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuth}>
        <App />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  // Example assertion
  expect(screen.getByText(/learn react/i)).toBeInTheDocument();
});
