import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const QuizContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
  marginTop: theme.spacing(2),
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

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  category: string;
  difficulty: number;
  relatedFlashcardId?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  category: string;
  onComplete: (results: QuizResult) => void;
  timed?: boolean;
  timeLimit?: number; // in seconds
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  totalTime: number;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  category,
  onComplete,
  timed = false,
  timeLimit = 60,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResult>({
    totalQuestions: questions.length,
    correctAnswers: 0,
    score: 0,
    answers: [],
    totalTime: 0,
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [remainingTime, setRemainingTime] = useState<number>(timeLimit);

  // Timer effect for timed quizzes
  React.useEffect(() => {
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
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionObj = currentQuestion.options.find(opt => opt.id === selectedOption);
    const isCorrect = selectedOptionObj?.isCorrect || false;
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    // Update results
    const updatedResults = {
      ...results,
      correctAnswers: isCorrect ? results.correctAnswers + 1 : results.correctAnswers,
      answers: [
        ...results.answers,
        {
          questionId: currentQuestion.id,
          selectedOptionId: selectedOption || '',
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
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const selectedOptionObj = currentQuestion?.options.find(opt => opt.id === selectedOption);

  // Generate stars based on difficulty (1-5)
  const difficultyStars = currentQuestion ? '★'.repeat(currentQuestion.difficulty) + '☆'.repeat(5 - currentQuestion.difficulty) : '';

  if (quizCompleted) {
    return (
      <QuizContainer elevation={3}>
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
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Your answer: {question.options.find(opt => opt.id === answer.selectedOptionId)?.text || "No answer"}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Correct answer: {question.options.find(opt => opt.isCorrect)?.text}
                </Typography>
                {!answer.isCorrect && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Explanation:</strong> {question.explanation}
                  </Typography>
                )}
              </CardContent>
            </ResultCard>
          );
        })}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary">
            Return to Dashboard
          </Button>
        </Box>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer elevation={3}>
      <ProgressContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          {timed && (
            <Typography variant="body2" color={remainingTime < 10 ? "error.main" : "text.secondary"}>
              Time remaining: {remainingTime}s
            </Typography>
          )}
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </ProgressContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip label={category} color="primary" />
        <Typography variant="body2" color="text.secondary">
          Difficulty: {difficultyStars}
        </Typography>
      </Box>

      <QuestionContainer>
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question}
        </Typography>
      </QuestionContainer>

      <OptionsContainer>
        <RadioGroup
          value={selectedOption}
          onChange={handleOptionChange}
        >
          {currentQuestion.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
              disabled={showExplanation}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                ...(showExplanation && option.isCorrect && {
                  backgroundColor: 'success.light',
                  borderColor: 'success.main',
                }),
                ...(showExplanation && selectedOption === option.id && !option.isCorrect && {
                  backgroundColor: 'error.light',
                  borderColor: 'error.main',
                }),
              }}
            />
          ))}
        </RadioGroup>
      </OptionsContainer>

      {showExplanation && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Explanation:
          </Typography>
          <Typography variant="body2">
            {currentQuestion.explanation}
          </Typography>
        </Box>
      )}

      <ActionContainer>
        <Button 
          variant="outlined" 
          disabled={currentQuestionIndex === 0 || showExplanation}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          Previous
        </Button>
        
        {!showExplanation ? (
          <Button 
            variant="contained" 
            color="primary" 
            disabled={!selectedOption}
            onClick={handleCheckAnswer}
          >
            Check Answer
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </ActionContainer>
    </QuizContainer>
  );
};

export default Quiz;
