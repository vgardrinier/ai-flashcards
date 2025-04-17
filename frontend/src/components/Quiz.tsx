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
import { quizAPI } from '../api';
import { eloAPI } from '../api/eloAPI';
import { QuizQuestion as ApiQuizQuestion, QuizResults } from '../types/api';

// Verify the imported eloAPI
console.log('Quiz component - Imported eloAPI:', {
  eloAPI,
  hasUpdateScore: 'updateScore' in eloAPI,
  updateScoreType: typeof eloAPI.updateScore
});

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
  category: {
    id: number;
    name: string;
  };
  difficulty: number;
}

interface QuizProps {
  categoryId: number;
  userId: number;
  onComplete: (results: QuizResults) => void;
  timed?: boolean;
  timeLimit?: number;
}

const Quiz: React.FC<QuizProps> = ({
  categoryId,
  userId,
  onComplete,
  timed = false,
  timeLimit = 60,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults>({
    categoryId,
    totalQuestions: 0,
    correctAnswers: 0,
    score: 0,
    totalEloChange: 0,
    answers: [],
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

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
      category: apiQuestion.category,
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
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  // Timer effect for timed quizzes
  useEffect(() => {
    if (!timed || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
    setQuizCompleted(true);
    onComplete(results);
  };

  const handleOptionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value as 'a' | 'b' | 'c' | 'd';
    
    // Prevent changing answer if already submitted
    if (showExplanation) return;
    
    setSelectedOption(option);
    try {
      // Ensure difficulty is within valid range (1-5)
      const questionDifficulty = Math.min(Math.max(questions[currentQuestionIndex].difficulty, 1), 5);
      
      const response = await quizAPI.submitAnswer(
        questions[currentQuestionIndex].id,
        userId,
        option,
        questionDifficulty
      );
      
      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const { correct: isCorrect, score_change: scoreChange, explanation: apiExplanation } = response.data.data;
        const currentExplanation = apiExplanation || questions[currentQuestionIndex].explanation || 'No explanation available.';
        
        setCorrect(isCorrect);
        setScoreChange(scoreChange);
        setExplanation(currentExplanation);
        
        // Update results with the new answer and accumulate ELO change
        setResults(prev => {
          const newTotalEloChange = prev.totalEloChange + scoreChange;
          console.log('Updating totalEloChange:', {
            previous: prev.totalEloChange,
            currentChange: scoreChange,
            newTotal: newTotalEloChange
          });
          
          return {
            ...prev,
            correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
            score: Math.round(((prev.correctAnswers + (isCorrect ? 1 : 0)) / questions.length) * 100),
            totalEloChange: newTotalEloChange,
            answers: [
              ...prev.answers,
              {
                questionId: questions[currentQuestionIndex].id,
                selectedOption: option,
                correct: isCorrect,
                explanation: currentExplanation,
                scoreChange: scoreChange
              }
            ]
          };
        });

        setShowExplanation(true);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setCorrect(null);
      setScoreChange(null);
      setExplanation('');
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      setQuizCompleted(true);
      onComplete(results);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setCorrect(null);
      setScoreChange(null);
      setExplanation('');
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    }
  };

  if (isLoading) {
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
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
          <Chip 
            label={`Quiz Score: ${results.score}%`} 
            color={results.score >= 70 ? "success" : results.score >= 50 ? "warning" : "error"} 
            variant="outlined" 
          />
          <Chip 
            label={`${results.correctAnswers}/${results.totalQuestions} correct`} 
            color="primary" 
            variant="outlined" 
          />
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Total ELO Score Changes:
          </Typography>
          <Typography variant="h5" color="primary" align="center" fontWeight="bold">
            {results.totalEloChange > 0 ? '+' : ''}{results.totalEloChange} points
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Your ELO score has been updated after each question.
            Check your profile to see your current ELO score and level.
          </Typography>
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

        {results.answers.map((answer, index) => {
          return (
            <ResultCard key={answer.questionId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question {index + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      size="small"
                      label={answer.correct ? "Correct" : "Incorrect"} 
                      color={answer.correct ? "success" : "error"} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {answer.scoreChange > 0 ? '+' : ''}{answer.scoreChange} points
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" gutterBottom>
                  {questions[index].question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your answer: {answer.selectedOption}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explanation: {answer.explanation}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </CardContent>
            </ResultCard>
          );
        })}
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : quizCompleted ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Quiz Completed!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your score: {results.score}%
          </Typography>
          <Typography variant="body1" gutterBottom>
            Correct answers: {results.correctAnswers} out of {results.totalQuestions}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Answers:
          </Typography>
          {results.answers.map((answer, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body1">
                Question {index + 1}: {questions[index].question}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your answer: {answer.selectedOption.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Correct answer: {questions[index].correct_option.toUpperCase()}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Chip 
                  size="small"
                  label={answer.correct ? "Correct" : "Incorrect"} 
                  color={answer.correct ? "success" : "error"} 
                />
              </Box>
              {answer.explanation && (
                <Typography variant="body2" color="text.secondary">
                  Explanation: {answer.explanation}
                </Typography>
              )}
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          <ProgressContainer>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
            />
          </ProgressContainer>
          {timed && (
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Chip 
                label={`Time left: ${timeLeft}s`} 
                color={timeLeft <= 10 ? "error" : "default"}
              />
            </Box>
          )}
          <QuestionContainer>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentQuestion.explanation}
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <FormControlLabel
                  value="a"
                  control={<Radio />}
                  label={currentQuestion.option_a}
                />
                <FormControlLabel
                  value="b"
                  control={<Radio />}
                  label={currentQuestion.option_b}
                />
                <FormControlLabel
                  value="c"
                  control={<Radio />}
                  label={currentQuestion.option_c}
                />
                <FormControlLabel
                  value="d"
                  control={<Radio />}
                  label={currentQuestion.option_d}
                />
              </RadioGroup>
            </FormControl>
          </QuestionContainer>
          {showExplanation && (
            <ResultCard>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {correct ? "Correct!" : "Incorrect"}
                </Typography>
                {scoreChange !== null && (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Score change for this question: {scoreChange > 0 ? "+" : ""}{scoreChange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Note: Your ELO score is updated after each question. The final score will reflect all your accumulated changes.
                    </Typography>
                  </>
                )}
                <Typography variant="body2" color="text.secondary">
                  {explanation}
                </Typography>
              </CardContent>
            </ResultCard>
          )}
          <ActionContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </ActionContainer>
        </Box>
      )}
    </QuizContainer>
  );
};

export default Quiz;
