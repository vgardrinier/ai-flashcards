// Component to display ELO level progression chart
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';

// Styled components
const ProgressionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const LevelCard = styled(Paper)(({ theme, active, completed }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '8px',
  position: 'relative',
  transition: 'all 0.3s ease',
  opacity: completed ? 0.85 : active ? 1 : 0.7,
  transform: active ? 'scale(1.05)' : 'scale(1)',
  boxShadow: active 
    ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
    : completed 
      ? '0 4px 8px rgba(0, 0, 0, 0.1)' 
      : '0 2px 4px rgba(0, 0, 0, 0.05)',
  background: completed 
    ? 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)' 
    : active 
      ? 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)' 
      : 'white',
  color: (completed || active) ? 'white' : theme.palette.text.primary,
}));

const LevelTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    marginLeft: theme.spacing(0.5),
    fontSize: '1rem',
  },
}));

const ScoreRange = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  marginBottom: theme.spacing(1),
}));

const ArrowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const CompletedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  backgroundColor: '#FFD700',
  borderRadius: '50%',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  '& svg': {
    fontSize: '0.9rem',
    color: 'white',
  },
}));

const EloLevelProgression = ({ currentScore, levels }) => {
  // Find current level
  const currentLevel = levels.find(level => 
    currentScore >= level.min_score && currentScore <= level.max_score
  ) || levels[0];
  
  // Get visible levels (current, previous, and next)
  const currentIndex = levels.findIndex(level => level.name === currentLevel.name);
  const startIndex = Math.max(0, currentIndex - 1);
  const endIndex = Math.min(levels.length - 1, currentIndex + 3);
  const visibleLevels = levels.slice(startIndex, endIndex + 1);
  
  return (
    <ProgressionContainer>
      <Typography variant="h6" gutterBottom>
        ELO Level Progression
      </Typography>
      
      <Grid container spacing={1} alignItems="center">
        {visibleLevels.map((level, index) => {
          const isActive = level.name === currentLevel.name;
          const isCompleted = currentScore > level.max_score;
          
          return (
            <React.Fragment key={level.name}>
              {index > 0 && (
                <Grid item xs={1}>
                  <ArrowContainer>
                    <ArrowForwardIcon />
                  </ArrowContainer>
                </Grid>
              )}
              
              <Grid item xs={index === 0 ? 3 : 2}>
                <LevelCard active={isActive} completed={isCompleted}>
                  {isCompleted && (
                    <CompletedBadge>
                      <StarIcon />
                    </CompletedBadge>
                  )}
                  <LevelTitle variant="subtitle2">
                    {level.name}
                  </LevelTitle>
                  <ScoreRange variant="body2">
                    {level.min_score} - {level.max_score === Infinity ? '∞' : level.max_score}
                  </ScoreRange>
                </LevelCard>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
        {currentLevel.description}
      </Typography>
    </ProgressionContainer>
  );
};

export default EloLevelProgression;
