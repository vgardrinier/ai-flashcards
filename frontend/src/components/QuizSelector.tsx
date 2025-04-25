import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Quiz from './Quiz';
import { QuizResults } from '../types/api';

const SelectorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

interface QuizSelectorProps {
  categoryId: number;
  userId: number;
  onComplete: (results: QuizResults) => void;
}

const QuizSelector: React.FC<QuizSelectorProps> = ({ 
  categoryId, 
  userId, 
  onComplete 
}) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizStarted(false);
    onComplete(results);
  };

  if (quizStarted) {
    return (
      <Quiz 
        categoryId={categoryId}
        userId={userId}
        onComplete={handleQuizComplete}
        maxQuestions={questionCount}
      />
    );
  }

  return (
    <SelectorContainer>
      <Typography variant="h5" gutterBottom align="center">
        Configure Your Quiz
      </Typography>
      
      <StyledCard>
        <CardContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Number of Questions</FormLabel>
            <RadioGroup
              aria-label="question-count"
              name="question-count"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              <FormControlLabel value={3} control={<Radio />} label="3 Questions (Quick Quiz)" />
              <FormControlLabel value={5} control={<Radio />} label="5 Questions (Standard Quiz)" />
              <FormControlLabel value={7} control={<Radio />} label="7 Questions (Extended Quiz)" />
            </RadioGroup>
          </FormControl>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleStartQuiz}
            sx={{ 
              px: 4, 
              borderRadius: '20px',
              fontWeight: 'bold'
            }}
          >
            Start Quiz
          </Button>
        </CardActions>
      </StyledCard>
    </SelectorContainer>
  );
};

export default QuizSelector;