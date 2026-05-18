import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeInput from '@/components/CodeInput/CodeInput';

describe('CodeInput', () => {
  it('Review button is disabled when code is empty', () => {
    render(<CodeInput onReview={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: 'Review →' })).toBeDisabled();
  });

  it('Review button is disabled while loading', () => {
    render(<CodeInput onReview={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: 'Reviewing...' })).toBeDisabled();
  });

  it('Review button is enabled when code is present', async () => {
    const user = userEvent.setup();
    render(<CodeInput onReview={vi.fn()} loading={false} />);
    await user.type(screen.getByPlaceholderText('Paste your code here...'), 'let x = 1;');
    expect(screen.getByRole('button', { name: 'Review →' })).toBeEnabled();
  });

  it('calls onReview with code and selected language', async () => {
    const onReview = vi.fn();
    const user = userEvent.setup();
    render(<CodeInput onReview={onReview} loading={false} />);

    await user.type(screen.getByPlaceholderText('Paste your code here...'), 'const x = 1;');
    await user.selectOptions(screen.getByRole('combobox'), 'Python');
    await user.click(screen.getByRole('button', { name: 'Review →' }));

    expect(onReview).toHaveBeenCalledOnce();
    expect(onReview).toHaveBeenCalledWith('const x = 1;', 'Python');
  });

  it('does not call onReview when code is whitespace only', async () => {
    const onReview = vi.fn();
    const user = userEvent.setup();
    render(<CodeInput onReview={onReview} loading={false} />);

    await user.type(screen.getByPlaceholderText('Paste your code here...'), '   ');
    await user.click(screen.getByRole('button', { name: 'Review →' }));

    expect(onReview).not.toHaveBeenCalled();
  });

  it('shows character count when code is not empty', async () => {
    const user = userEvent.setup();
    render(<CodeInput onReview={vi.fn()} loading={false} />);
    await user.type(screen.getByPlaceholderText('Paste your code here...'), 'hello');
    expect(screen.getByText('5 chars')).toBeInTheDocument();
  });

  it('hides character count when textarea is empty', () => {
    render(<CodeInput onReview={vi.fn()} loading={false} />);
    expect(screen.queryByText(/chars/)).not.toBeInTheDocument();
  });

  it('syncs value prop to textarea', () => {
    render(<CodeInput onReview={vi.fn()} loading={false} value="injected code" />);
    expect(screen.getByPlaceholderText('Paste your code here...')).toHaveValue('injected code');
  });
});
