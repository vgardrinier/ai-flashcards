// Component to display ELO score and level information
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Paper, Grid, Tooltip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ELOLevel } from '../types';

interface EloScoreDisplayProps {
  score: number | null;
  level: ELOLevel | null;
  progress: number;
  pointsToNext: number | null;
}

interface LevelBadgeProps {
  levelName: string;
}

// Styled components
const LevelBadge = styled(Paper)<LevelBadgeProps>(({ theme, levelName }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
  background: getLevelColor(levelName),
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  position: 'relative',
  overflow: 'hidden'
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ScoreDisplay = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '2.5rem',
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const LevelName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    color: '#FFD700',
  },
}));

const NextLevelInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(1),
}));

// Helper function to get color based on level
function getLevelColor(levelName: string): string {
  const levelColors: Record<string, string> = {
    'Novice Explorer': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    'AI Apprentice': 'linear-gradient(135deg, #B2EBF2 0%, #80DEEA 100%)',
    'ML Practitioner': 'linear-gradient(135deg, #80DEEA 0%, #4DD0E1 100%)',
    'Deep Learning Enthusiast': 'linear-gradient(135deg, #4DD0E1 0%, #26C6DA 100%)',
    'NLP Specialist': 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
    'AI Systems Architect': 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)',
    'Agent Engineer': 'linear-gradient(135deg, #00ACC1 0%, #0097A7 100%)',
    'AI Research Lead': 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)',
    'AI Product Director': 'linear-gradient(135deg, #00838F 0%, #006064 100%)',
    'Tier-1 AI CTO': 'linear-gradient(135deg, #006064 0%, #004D40 100%)'
  };
  
  return levelColors[levelName] || 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)';
}

const EloScoreDisplay: React.FC<EloScoreDisplayProps> = ({ score, level, progress, pointsToNext }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate score counting up - moved before conditional return
  useEffect(() => {
    if (!score) return;
    
    const duration = 1500; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = score / totalFrames;
    
    let currentFrame = 0;
    
    const timer = setInterval(() => {
      currentFrame++;
      setAnimatedScore(Math.min(Math.round(increment * currentFrame), score));
      
      if (currentFrame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, [score]);
  
  if (!score || !level) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <LevelBadge levelName={level.name}>
        <Box>
          <Typography variant="h6" component="div">
            {level.name}
          </Typography>
          <ScoreDisplay>{animatedScore}</ScoreDisplay>
          <Typography variant="body2" color="text.secondary">
            {level.description}
          </Typography>
        </Box>
      </LevelBadge>
      <ProgressContainer>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" color="text.secondary" align="center">
          {pointsToNext !== null ? `${pointsToNext} points to next level` : 'Calculating...'}
        </Typography>
      </ProgressContainer>
    </Box>
  );
};

export default EloScoreDisplay;
