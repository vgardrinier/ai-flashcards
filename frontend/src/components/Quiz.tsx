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
  maxQuestions?: number; // New prop for limiting the number of questions
}

const Quiz: React.FC<QuizProps> = ({
  categoryId,
  userId,
  onComplete,
  timed = false,
  timeLimit = 60,
  maxQuestions,
}): React.ReactElement => {
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]); // All fetched questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Questions to be used in the quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [quizSessionId, setQuizSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults>({
    categoryId,
    userId,
    totalQuestions: 0,
    correctAnswers: 0,
    score: 0,
    totalEloChange: 0,
    answers: []
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

  // Select a subset of questions
  const selectQuestions = (allQuestions: QuizQuestion[], maxCount?: number) => {
    if (!maxCount || maxCount >= allQuestions.length) {
      return [...allQuestions]; // Use all questions if no limit or if limit exceeds available questions
    }
    
    // Randomly select maxCount questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxCount);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await quizAPI.getAll(categoryId);
        if (response.status >= 200 && response.status < 300) {
          const apiQuestions = response.data as unknown as ApiQuizQuestion[];
          const convertedQuestions = apiQuestions.map(convertApiQuestionToQuizQuestion);
          setAllQuestions(convertedQuestions);
          
          // Select questions based on maxQuestions
          const selectedQuestions = selectQuestions(convertedQuestions, maxQuestions);
          setQuestions(selectedQuestions);
          setResults(prev => ({ ...prev, totalQuestions: selectedQuestions.length }));
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
  }, [categoryId, maxQuestions]);

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
        questionDifficulty,
        quizSessionId
      );
      
      if (response.status >= 200 && response.status < 300 && response.data.data) {
        const { 
          correct: isCorrect, 
          score_change: scoreChange, 
          explanation: apiExplanation,
          quiz_session_id: responseSessionId,
          elo_score_after: eloScoreAfter
        } = response.data.data;
        
        const currentExplanation = apiExplanation || questions[currentQuestionIndex].explanation || 'No explanation available.';
        
        // Store the session ID for future questions in this quiz
        if (responseSessionId && quizSessionId === undefined) {
          setQuizSessionId(responseSessionId);
        }
        
        setIsCorrect(isCorrect);
        setScoreChange(scoreChange);
        setExplanation(currentExplanation);
        
        // Update results with the new answer and accumulate ELO change
        setResults(prev => {
          const newTotalEloChange = prev.totalEloChange + scoreChange;
          console.log('Updating totalEloChange:', {
            previous: prev.totalEloChange,
            currentChange: scoreChange,
            newTotal: newTotalEloChange,
            sessionId: responseSessionId
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
      setIsCorrect(null);
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
      setIsCorrect(null);
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
          const question = questions.find(q => q.id === answer.questionId);
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
                  {question?.question}
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
          <Typography variant="h4" gutterBottom>Quiz Completed!</Typography>
          <Typography variant="body1">
            You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly.
          </Typography>
          <Typography variant="body1">
            Your final score is {results.score}%.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => onComplete(results)}
            sx={{ mt: 2 }}
          >
            View Results
          </Button>
        </Box>
      ) : (
        <Box>
          {timed && (
            <Typography variant="h6" gutterBottom>
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
          )}
          <ProgressContainer>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
            />
          </ProgressContainer>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.question}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedOption || ''}
                  onChange={handleOptionChange}
                >
                  <FormControlLabel 
                    value="a" 
                    control={<Radio />} 
                    label={questions[currentQuestionIndex].option_a}
                    disabled={showExplanation}
                  />
                  <FormControlLabel 
                    value="b" 
                    control={<Radio />} 
                    label={questions[currentQuestionIndex].option_b}
                    disabled={showExplanation}
                  />
                  <FormControlLabel 
                    value="c" 
                    control={<Radio />} 
                    label={questions[currentQuestionIndex].option_c}
                    disabled={showExplanation}
                  />
                  <FormControlLabel 
                    value="d" 
                    control={<Radio />} 
                    label={questions[currentQuestionIndex].option_d}
                    disabled={showExplanation}
                  />
                </RadioGroup>
              </FormControl>
              {showExplanation && (
                <Box sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </Typography>
                    {scoreChange !== null && (
                      <Typography variant="body1" gutterBottom>
                        Score Change: {scoreChange > 0 ? '+' : ''}{scoreChange}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      {explanation}
                    </Typography>
                  </CardContent>
                </Box>
              )}
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={!showExplanation}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </QuizContainer>
  );
};

export default Quiz;