import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('floats the label once focused, even with no value yet', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveStyle({ paddingTop: '0px' });

    await user.click(input);
    expect(input).toHaveStyle({ paddingTop: '16px' });
  });

  it('keeps the label floated after blur if the field has a value', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email');
    await user.type(input, 'user@example.com');
    await user.tab(); // blur

    expect(input).toHaveStyle({ paddingTop: '16px' });
  });

  it('un-floats the label after blur when the field is empty', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email');
    await user.click(input);
    await user.tab(); // blur without typing anything

    expect(input).toHaveStyle({ paddingTop: '0px' });
  });

  it('shows the error message with an alert role when error is set', () => {
    render(<Input placeholder="Email" error="Email is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('renders a controlled value as already floated on first render', () => {
    render(<Input placeholder="Email" value="user@example.com" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveStyle({ paddingTop: '16px' });
  });
});
