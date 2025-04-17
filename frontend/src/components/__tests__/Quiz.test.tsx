import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from '../Quiz';
import { quizAPI } from '../../api';

jest.mock('../../api', () => ({
  quizAPI: {
    submitAnswer: jest.fn(),
    getAll: jest.fn()
  }
}));

const mockQuestions = [
  {
    id: 1,
    question: 'What is 2 + 2?',
    option_a: '3',
    option_b: '4',
    option_c: '5',
    option_d: '6',
    correct_option: 'b' as const,
    explanation: 'Basic arithmetic: 2 + 2 = 4',
    category: {
      id: 1,
      name: 'Math'
    },
    difficulty: 1
  }
];

describe('Quiz Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (quizAPI.getAll as jest.Mock).mockResolvedValue({
      status: 200,
      data: mockQuestions
    });
  });

  it('handles correct answer submission', async () => {
    (quizAPI.submitAnswer as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          correct: true,
          score_change: 10,
          explanation: 'Basic arithmetic: 2 + 2 = 4'
        }
      }
    });

    render(<Quiz categoryId={1} userId={123} onComplete={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('4'));
    
    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
      expect(screen.getByText('Basic arithmetic: 2 + 2 = 4')).toBeInTheDocument();
    });
  });

  it('handles incorrect answer submission', async () => {
    (quizAPI.submitAnswer as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          correct: false,
          score_change: -5,
          explanation: 'The correct answer is 4'
        }
      }
    });

    render(<Quiz categoryId={1} userId={123} onComplete={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('3'));
    
    await waitFor(() => {
      expect(screen.getByText('Incorrect')).toBeInTheDocument();
      expect(screen.getByText('The correct answer is 4')).toBeInTheDocument();
    });
  });

  it('displays final score and calls onComplete', async () => {
    const mockOnComplete = jest.fn();
    (quizAPI.submitAnswer as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        data: {
          correct: true,
          score_change: 10,
          explanation: 'Basic arithmetic: 2 + 2 = 4'
        }
      }
    });

    render(<Quiz categoryId={1} userId={123} onComplete={mockOnComplete} />);
    
    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('4'));
    
    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Finish Quiz'));

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        correctAnswers: 1,
        score: 100,
        answers: expect.arrayContaining([
          expect.objectContaining({
            questionId: 1,
            selectedOption: 'b',
            isCorrect: true,
            explanation: 'Basic arithmetic: 2 + 2 = 4'
          })
        ])
      }));
    });
  });
}); 