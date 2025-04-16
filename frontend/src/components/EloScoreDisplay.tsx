// Component to display ELO score and level information
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Paper, Grid, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Styled components
const LevelBadge = styled(Paper)(({ theme, level }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
  background: getLevelColor(level),
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
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
function getLevelColor(level) {
  const levelColors = {
    'Novice Explorer': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    'AI Apprentice': 'linear-gradient(135deg, #B2EBF2 0%, #80DEEA 100%)',
    'ML Practitioner': 'linear-gradient(135deg, #80DEEA 0%, #4DD0E1 100%)',
    'Deep Learning Enthusiast': 'linear-gradient(135deg, #4DD0E1 0%, #26C6DA 100%)',
    'NLP Specialist': 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
    'AI Systems Architect': 'linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%)',
    'Agent Engineer': 'linear-gradient(135deg, #00ACC1 0%, #0097A7 100%)',
    'Technical AI Leader': 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)',
    'AI Startup Strategist': 'linear-gradient(135deg, #00838F 0%, #006064 100%)',
    'AI Innovation Director': 'linear-gradient(135deg, #006064 0%, #004D40 100%)',
    'Senior AI Executive': 'linear-gradient(135deg, #004D40 0%, #00352C 100%)',
    'Tier-1 AI CTO': 'linear-gradient(135deg, #00352C 0%, #002419 100%)',
  };
  
  return levelColors[level] || 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)';
}

const EloScoreDisplay = ({ score, level, progress, pointsToNext }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate score counting up
  useEffect(() => {
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
  
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LevelBadge level={level.name} elevation={3}>
            <LevelName variant="h5">
              <EmojiEventsIcon />
              {level.name}
            </LevelName>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {level.description}
            </Typography>
            <ScoreDisplay variant="h3">{animatedScore}</ScoreDisplay>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
              ELO Score
            </Typography>
            
            <ProgressContainer>
              <Tooltip 
                title={`${progress}% through this level`} 
                placement="top"
                arrow
              >
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  }} 
                />
              </Tooltip>
            </ProgressContainer>
            
            {pointsToNext > 0 ? (
              <NextLevelInfo>
                {pointsToNext} points needed to reach next level
              </NextLevelInfo>
            ) : (
              <NextLevelInfo>
                You've reached the highest level!
              </NextLevelInfo>
            )}
          </LevelBadge>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EloScoreDisplay;
