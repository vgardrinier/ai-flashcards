// Component to display ELO level progression chart
import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { ELOLevel } from '../types';

interface EloLevelProgressionProps {
  levels: ELOLevel[];
  currentLevel: number;
}

interface LevelCardProps {
  isCurrent: boolean;
  isCompleted: boolean;
}

// Styled components
const ProgressionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const LevelCard = styled(Paper)<LevelCardProps>(({ theme, isCurrent, isCompleted }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '8px',
  backgroundColor: isCurrent 
    ? theme.palette.primary.main 
    : isCompleted 
      ? theme.palette.success.light 
      : theme.palette.grey[200],
  color: isCurrent ? theme.palette.primary.contrastText : theme.palette.text.primary,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
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
  top: 0,
  right: 0,
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontSize: '0.75rem',
  borderBottomLeftRadius: '8px'
}));

const EloLevelProgression: React.FC<EloLevelProgressionProps> = ({ levels, currentLevel }) => {
  return (
    <ProgressionContainer>
      <Typography variant="h6" gutterBottom>
        Level Progression
      </Typography>
      <Grid container spacing={2}>
        {levels.map((level, index) => (
          <Grid item xs={12} sm={6} md={4} key={level.name}>
            <LevelCard 
              isCurrent={index === currentLevel}
              isCompleted={index < currentLevel}
            >
              {index < currentLevel && (
                <CompletedBadge>Completed</CompletedBadge>
              )}
              <Typography variant="subtitle1" gutterBottom>
                {level.name}
              </Typography>
              <Typography variant="body2">
                Score Range: {level.minScore} - {level.maxScore}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {level.description}
              </Typography>
            </LevelCard>
          </Grid>
        ))}
      </Grid>
    </ProgressionContainer>
  );
};

export default EloLevelProgression;
