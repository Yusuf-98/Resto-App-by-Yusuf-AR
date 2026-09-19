import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalA11y } from './use-modal-a11y';

function TestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useModalA11y(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div ref={ref} role='dialog' aria-modal='true' tabIndex={-1}>
      <button>First</button>
      <button>Last</button>
    </div>
  );
}

describe('useModalA11y', () => {
  it('locks body scroll while open and restores it on close', () => {
    const { unmount } = render(<TestModal isOpen onClose={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TestModal isOpen onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus into the dialog when it opens', () => {
    render(<TestModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('returns focus to the trigger element after the dialog closes', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<TestModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveFocus();

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('traps Tab focus within the dialog, wrapping from the last to the first element', async () => {
    const user = userEvent.setup();
    render(<TestModal isOpen onClose={() => {}} />);

    const last = screen.getByRole('button', { name: 'Last' });
    last.focus();
    expect(last).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });
});
