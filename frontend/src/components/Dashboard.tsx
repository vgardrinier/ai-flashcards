import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  LinearProgress,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { 
  Quiz as QuizIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { ELOLevel } from '../types';
import { eloAPI } from '../api/eloAPI';
import EloAnalytics from './EloAnalytics';

const HeaderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const ScoreSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const StartQuizButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 6),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 600,
  fontSize: '1.2rem',
  textTransform: 'none',
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const LevelCard = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  margin: '0.5rem 0',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const LevelIcon = styled('img')({
  width: '48px',
  height: '48px',
  marginRight: '1rem',
});

const LevelInfo = styled('div')({
  flex: 1,
});

const LevelName = styled('h3')(({ theme }) => ({
  margin: 0,
  color: theme.palette.primary.main,
  fontSize: '1.2rem',
}));

const LevelDescription = styled('p')(({ theme }) => ({
  margin: '0.5rem 0',
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
}));

const LevelRange = styled('span')(({ theme }) => ({
  display: 'block',
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  marginTop: '0.25rem',
}));

interface DashboardProps {
  username: string;
  eloScore: number | null;
  currentLevel: ELOLevel | null;
  nextLevel: ELOLevel | null;
  progressToNextLevel: number;
  studyStreak: number;
  onStartQuiz?: () => void;
  levels: ELOLevel[];
  userId: number;
}

interface EloScore {
  id: number;
  user_id: number;
  score: number;
  created_at: string;
  updated_at: string;
}

interface ApiEloLevel {
  id: number;
  name: string;
  min_score: number;
  max_score: number;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface HistoryEntry {
  date: string;
  score: number;
  change: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  username,
  eloScore,
  currentLevel,
  nextLevel,
  progressToNextLevel,
  studyStreak,
  onStartQuiz,
  levels,
  userId,
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await eloAPI.getHistory(userId);
        console.log('History response:', response);
        if (response.data) {
          // Transform the API response to match HistoryEntry interface
          const transformedHistory: HistoryEntry[] = response.data.map((entry: EloScore, index: number, arr: EloScore[]) => ({
            date: entry.created_at,
            score: entry.score,
            change: index > 0 ? entry.score - arr[index - 1].score : 0,
          }));
          console.log('Transformed history:', transformedHistory);
          setHistory(transformedHistory);
        }
      } catch (error) {
        console.error('Error fetching ELO history:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  if (!eloScore || !currentLevel || !nextLevel) {
    console.log('Dashboard loading state:', { eloScore, currentLevel, nextLevel });
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography>
          Loading your dashboard...
          {!eloScore && ' (Waiting for score)'}
          {!currentLevel && ' (Calculating current level)'}
          {!nextLevel && ' (Determining next level)'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <HeaderCard>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {username}!
        </Typography>
        <ScoreSection>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              {currentLevel.name}
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff' }}>
            {eloScore}
          </Typography>
          {studyStreak > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                🔥 {studyStreak} day streak
              </Typography>
            </Box>
          )}
        </ScoreSection>
        
        <Box sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Progress to {nextLevel.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {nextLevel.minScore - eloScore} points to go
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressToNextLevel}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          />
        </Box>

        <StartQuizButton
          variant="contained"
          startIcon={<QuizIcon />}
          onClick={onStartQuiz}
        >
          Start New Quiz
        </StartQuizButton>
      </HeaderCard>

      {/* Debug information */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Debug: History entries: {history.length}, Levels: {levels.length}
          </Typography>
        </Box>
      )}

      {/* Only render EloAnalytics if we have both history and levels data */}
      {history.length > 0 && levels.length > 0 ? (
        <EloAnalytics history={history} levels={levels} />
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Loading analytics data...
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
