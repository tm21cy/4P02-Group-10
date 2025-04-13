// Mocks BEFORE imports
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
  }));
  
  jest.mock('@clerk/nextjs', () => ({
    useUser: jest.fn(),
  }));
  
  jest.mock('@/lib/store', () => ({
    useSubscriptionStore: jest.fn(),
  }));
  
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import BillingForm from '@/app/(routes)/billing/BillingForm';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { useUser } from '@clerk/nextjs';
  import { useSubscriptionStore } from '@/lib/store';
  import React from "react";
  
  const mockPush = jest.fn();
  const mockSetSubscribed = jest.fn();
  const mockSearchParams = {
    get: jest.fn(),
  };
  
  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
  
    useUser.mockReturnValue({
      user: { id: 'user-123' },
    });
  
    useSearchParams.mockReturnValue(mockSearchParams);
  
    useSubscriptionStore.mockImplementation((selector) =>
      selector({
        subscriptions: {},
        setSubscribed: mockSetSubscribed,
      })
    );
  });
  
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('submits the form and redirects to /ai-chat', async () => {
    render(<BillingForm />);
  
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Acme Inc.' },
    });
    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: 'Manager' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
  
    await waitFor(() => {
      expect(mockSetSubscribed).toHaveBeenCalledWith('user-123', true);
      expect(mockPush).toHaveBeenCalledWith('/ai-chat');
    });
  });
  
  test('renders monthly plan when query param is "monthly"', () => {
    mockSearchParams.get.mockReturnValueOnce('monthly');
  
    render(<BillingForm />);
  
    expect(screen.getByText(/Monthly Plan - \$5\/month/i)).toBeInTheDocument();
  });
  
  test('renders annual plan when query param is "annual"', () => {
    mockSearchParams.get.mockReturnValueOnce('annual');
  
    render(<BillingForm />);
  
    expect(screen.getByText(/Annual Plan - \$30\/year/i)).toBeInTheDocument();
  });
  