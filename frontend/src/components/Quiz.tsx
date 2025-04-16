import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Button, 
  Paper, 
  LinearProgress, 
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { quizAPI, eloAPI } from '../api';
import { QuizQuestion as ApiQuizQuestion } from '../types/api';

const QuizContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
  marginTop: theme.spacing(2),
  elevation: 3,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const QuestionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const OptionsContainer = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export interface QuizQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  category_id: number;
  difficulty: number;
}

interface QuizProps {
  categoryId: number;
  userId: number;
  onComplete: (results: QuizResult) => void;
  timed?: boolean;
  timeLimit?: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: {
    questionId: string | number;
    selectedOption: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  totalTime: number;
}

const Quiz: React.FC<QuizProps> = ({
  categoryId,
  userId,
  onComplete,
  timed = false,
  timeLimit = 60,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResult>({
    totalQuestions: 0,
    correctAnswers: 0,
    score: 0,
    answers: [],
    totalTime: 0,
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [remainingTime, setRemainingTime] = useState<number>(timeLimit);

  const convertApiQuestionToQuizQuestion = (apiQuestion: ApiQuizQuestion): QuizQuestion => {
    return {
      id: apiQuestion.id,
      question: apiQuestion.question,
      option_a: apiQuestion.option_a,
      option_b: apiQuestion.option_b,
      option_c: apiQuestion.option_c,
      option_d: apiQuestion.option_d,
      correct_option: apiQuestion.correct_option as 'a' | 'b' | 'c' | 'd',
      explanation: apiQuestion.explanation,
      category_id: apiQuestion.category_id,
      difficulty: apiQuestion.difficulty,
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await quizAPI.getAll(categoryId);
        if (response.status >= 200 && response.status < 300) {
          const apiQuestions = response.data as unknown as ApiQuizQuestion[];
          const convertedQuestions = apiQuestions.map(convertApiQuestionToQuizQuestion);
          setQuestions(convertedQuestions);
          setResults(prev => ({ ...prev, totalQuestions: convertedQuestions.length }));
        } else {
          setError(`Failed to fetch questions: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Error connecting to the server: ${errorMessage}`);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  // Timer effect for timed quizzes
  useEffect(() => {
    if (!timed || quizCompleted) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timed, quizCompleted]);

  const handleTimeUp = () => {
    // Auto-submit the quiz when time is up
    const finalResults = {
      ...results,
      totalTime: (Date.now() - startTime) / 1000,
    };
    setResults(finalResults);
    setQuizCompleted(true);
    onComplete(finalResults);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'a' | 'b' | 'c' | 'd' | null);
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    try {
      const response = await quizAPI.submitAnswer(
        currentQuestion.id,
        userId,
        selectedOption
      );

      if (response.status >= 200 && response.status < 300) {
        const isCorrect = response.data.data.correct;
        const scoreChange = response.data.data.score_change;
        
        // Update results
        const updatedResults = {
          ...results,
          correctAnswers: isCorrect ? results.correctAnswers + 1 : results.correctAnswers,
          answers: [
            ...results.answers,
            {
              questionId: currentQuestion.id,
              selectedOption,
              isCorrect,
              timeTaken,
            },
          ],
        };
        setResults(updatedResults);

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowExplanation(false);
          setQuestionStartTime(Date.now());
        } else {
          // Quiz completed
          const finalResults = {
            ...updatedResults,
            score: Math.round((updatedResults.correctAnswers / questions.length) * 100),
            totalTime: (Date.now() - startTime) / 1000,
          };
          setResults(finalResults);
          setQuizCompleted(true);
          onComplete(finalResults);
        }
      } else {
        setError(`Failed to submit answer: ${response.data.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(`Error submitting answer: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  if (loading) {
    return (
      <QuizContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </QuizContainer>
    );
  }

  if (error) {
    return (
      <QuizContainer>
        <Alert severity="error">{error}</Alert>
      </QuizContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <QuizContainer>
        <Alert severity="info">No questions available for this category.</Alert>
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Generate stars based on difficulty (1-5)
  const difficultyStars = '★'.repeat(currentQuestion.difficulty) + '☆'.repeat(5 - currentQuestion.difficulty);

  if (quizCompleted) {
    return (
      <QuizContainer>
        <Typography variant="h4" gutterBottom align="center">
          Quiz Results
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip 
            label={`Score: ${results.score}%`} 
            color={results.score >= 70 ? "success" : results.score >= 50 ? "warning" : "error"} 
            variant="outlined" 
          />
          <Chip 
            label={`${results.correctAnswers}/${results.totalQuestions} correct`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`Time: ${Math.round(results.totalTime)}s`} 
            color="secondary" 
            variant="outlined" 
          />
        </Box>

        <Alert 
          severity={results.score >= 70 ? "success" : results.score >= 50 ? "warning" : "error"}
          sx={{ mb: 3 }}
        >
          {results.score >= 70 
            ? "Great job! You've demonstrated strong knowledge in this area." 
            : results.score >= 50 
              ? "Good effort! There's still room for improvement." 
              : "Keep studying! This topic needs more review."}
        </Alert>

        <Typography variant="h6" gutterBottom>
          Question Summary:
        </Typography>

        {questions.map((question, index) => {
          const answer = results.answers[index];
          return (
            <ResultCard key={question.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question {index + 1}
                  </Typography>
                  <Chip 
                    size="small"
                    label={answer.isCorrect ? "Correct" : "Incorrect"} 
                    color={answer.isCorrect ? "success" : "error"} 
                  />
                </Box>
                <Typography variant="body1" gutterBottom>
                  {question.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your answer: {answer.selectedOption}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time taken: {Math.round(answer.timeTaken)}s
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  {question.explanation}
                </Typography>
              </CardContent>
            </ResultCard>
          );
        })}
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <ProgressContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {difficultyStars}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </ProgressContainer>

      {timed && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" color={remainingTime <= 10 ? 'error' : 'textPrimary'}>
            Time remaining: {remainingTime}s
          </Typography>
        </Box>
      )}

      <QuestionContainer>
        <Typography variant="h6" gutterBottom>
          {currentQuestion.question}
        </Typography>

        <OptionsContainer>
          <RadioGroup value={selectedOption} onChange={handleOptionChange}>
            {['a', 'b', 'c', 'd'].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={currentQuestion[`option_${option}` as keyof ApiQuizQuestion] as string}
                disabled={showExplanation}
              />
            ))}
          </RadioGroup>
        </OptionsContainer>

        {showExplanation && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {currentQuestion.explanation}
            </Typography>
          </Box>
        )}
      </QuestionContainer>

      <ActionContainer>
        <Button
          variant="outlined"
          onClick={handleCheckAnswer}
          disabled={!selectedOption || showExplanation}
        >
          Check Answer
        </Button>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={!selectedOption}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </ActionContainer>
    </QuizContainer>
  );
};

export default Quiz;
