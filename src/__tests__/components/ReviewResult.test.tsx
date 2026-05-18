import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewResult from '@/components/ReviewResult/ReviewResult';
import { ReviewResponse } from '@/types/review';

const MOCK_REVIEW: ReviewResponse = {
  categories: [
    { type: 'bugs', label: 'Bugs', emoji: '🐛', items: [{ line: 5, description: 'Null pointer dereference' }] },
    { type: 'improvements', label: 'Improvements', emoji: '⚡', items: [] },
    { type: 'security', label: 'Security', emoji: '🔒', items: [] },
    { type: 'style', label: 'Code Style', emoji: '🎨', items: [] },
  ],
};

describe('ReviewResult', () => {
  it('shows placeholder when idle', () => {
    render(<ReviewResult review={null} loading={false} streamingText={null} error={null} />);
    expect(screen.getByText('Paste your code and click Review →')).toBeInTheDocument();
  });

  it('shows error message with role="alert"', () => {
    render(<ReviewResult review={null} loading={false} streamingText={null} error="GEMINI_API_KEY is not configured" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('GEMINI_API_KEY is not configured')).toBeInTheDocument();
  });

  it('does not show error block when error is null', () => {
    render(<ReviewResult review={null} loading={false} streamingText={null} error={null} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders review categories when review is ready', () => {
    render(<ReviewResult review={MOCK_REVIEW} loading={false} streamingText={null} error={null} />);
    expect(screen.getByText('Null pointer dereference')).toBeInTheDocument();
  });

  it('shows line number badge when item has a line', () => {
    render(<ReviewResult review={MOCK_REVIEW} loading={false} streamingText={null} error={null} />);
    expect(screen.getByText('L5')).toBeInTheDocument();
  });

  it('shows "No issues found" for empty categories', () => {
    render(<ReviewResult review={MOCK_REVIEW} loading={false} streamingText={null} error={null} />);
    const empties = screen.getAllByText('No issues found');
    expect(empties.length).toBeGreaterThanOrEqual(3);
  });

  it('shows Copy button when review is present', () => {
    render(<ReviewResult review={MOCK_REVIEW} loading={false} streamingText={null} error={null} />);
    expect(screen.getByRole('button', { name: /copy review/i })).toBeInTheDocument();
  });

  it('hides Copy button when there is no review', () => {
    render(<ReviewResult review={null} loading={false} streamingText={null} error={null} />);
    expect(screen.queryByRole('button', { name: /copy review/i })).not.toBeInTheDocument();
  });

  it('Copy button shows "Copied!" feedback after click', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    render(<ReviewResult review={MOCK_REVIEW} loading={false} streamingText={null} error={null} />);
    await user.click(screen.getByRole('button', { name: /copy review/i }));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
