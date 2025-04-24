export type ActivityType = 'quiz' | 'flashcard' | 'level_up';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  category: string;
  date: Date;
  details: string;
}

export interface ELOLevel {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  badgeIcon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalCards: number;
  masteredCards: number;
}

export interface QuizResults {
  categoryId: number;
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  totalEloChange: number;
  answers: Array<{
    questionId: number;
    selectedOption: string;
    correct: boolean;
    explanation: string;
    scoreChange: number;
  }>;
} 