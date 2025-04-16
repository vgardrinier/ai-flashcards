import React, { useState } from 'react';
import { Card, CardContent, CardActions as MuiCardActions, Typography, Button, Box, Chip, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  minHeight: 300,
  margin: '0 auto',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  '&.flipped': {
    transform: 'rotateY(180deg)',
  },
}));

const CardSide = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const CardFront = styled(CardSide)({
  zIndex: 2,
});

const CardBack = styled(CardSide)({
  transform: 'rotateY(180deg)',
});

const CardCategory = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
}));

const CardDifficulty = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const CardActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1)
}));

interface FlashcardProps {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string;
  difficulty: number;
  tags: string[];
  onNext: () => void;
  onPrevious: () => void;
  onMarkKnown: (id: string) => void;
  onMarkUnknown: (id: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  id,
  question,
  answer,
  explanation,
  category,
  difficulty,
  tags,
  onNext,
  onPrevious,
  onMarkKnown,
  onMarkUnknown,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkKnown = () => {
    onMarkKnown(id);
    setIsFlipped(false);
  };

  const handleMarkUnknown = () => {
    onMarkUnknown(id);
    setIsFlipped(false);
  };

  // Generate stars based on difficulty (1-5)
  const difficultyStars = '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

  return (
    <Box sx={{ perspective: 1500, width: '100%' }}>
      <StyledCard className={isFlipped ? 'flipped' : ''}>
        <CardFront>
          <CardCategory label={category} color="primary" />
          <CardDifficulty>
            <Typography variant="body2" color="text.secondary">
              {difficultyStars}
            </Typography>
          </CardDifficulty>
          
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" component="div" align="center" gutterBottom>
              {question}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
          
          <CardActions>
            <Button size="small" onClick={onPrevious}>Previous</Button>
            <Button size="medium" variant="contained" onClick={handleFlip}>
              Flip Card
            </Button>
            <Button size="small" onClick={onNext}>Next</Button>
          </CardActions>
        </CardFront>
        
        <CardBack>
          <CardCategory label={category} color="primary" />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Answer:
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              {answer}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Explanation:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {explanation}
            </Typography>
          </Box>
          
          <CardActions>
            <Button 
              size="small" 
              variant="outlined" 
              color="error" 
              onClick={handleMarkUnknown}
            >
              Don't Know
            </Button>
            <Button size="small" onClick={handleFlip}>
              Flip Back
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="success" 
              onClick={handleMarkKnown}
            >
              Know It
            </Button>
          </CardActions>
        </CardBack>
      </StyledCard>
    </Box>
  );
};

export default Flashcard;
