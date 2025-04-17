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

const LevelBadge = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const ScoreDisplay = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(1),
}));

const LevelName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  '& svg': {
    color: '#FFD700',
  },
}));

const NextLevelInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(1),
}));

const EloScoreDisplay: React.FC<EloScoreDisplayProps> = ({ score, level, progress, pointsToNext }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
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
    <LevelBadge>
      <Box>
        <LevelName>
          <EmojiEventsIcon />
          {level.name}
        </LevelName>
        <ScoreDisplay>{animatedScore}</ScoreDisplay>
        <Typography variant="body2" color="text.secondary">
          {level.description}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
            }
          }}
        />
        <NextLevelInfo>
          {pointsToNext !== null ? `${pointsToNext} points to next level` : 'Calculating...'}
        </NextLevelInfo>
      </Box>
    </LevelBadge>
  );
};

export default EloScoreDisplay;
