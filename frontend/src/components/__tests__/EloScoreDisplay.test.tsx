import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EloScoreDisplay from '../EloScoreDisplay';
import { ELOLevel } from '../../types';

describe('EloScoreDisplay Component', () => {
  const mockLevel: ELOLevel = {
    name: 'Novice Explorer',
    description: 'Starting your AI journey',
    minScore: 0,
    maxScore: 1000,
    badgeIcon: 'explorer'
  };

  const mockProps = {
    score: 1500,
    level: mockLevel,
    progress: 50,
    pointsToNext: 500
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders current ELO score correctly', () => {
    render(<EloScoreDisplay {...mockProps} />);
    
    act(() => {
      jest.advanceTimersByTime(1500); // Animation duration is 1500ms
    });

    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  it('renders level name correctly', () => {
    render(<EloScoreDisplay {...mockProps} />);
    expect(screen.getByText('Novice Explorer')).toBeInTheDocument();
  });

  it('renders progress bar with correct value', () => {
    render(<EloScoreDisplay {...mockProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders points to next level correctly', () => {
    render(<EloScoreDisplay {...mockProps} />);
    expect(screen.getByText('500 points to next level')).toBeInTheDocument();
  });
}); 