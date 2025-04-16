import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
}));

const LevelCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
}));

const BadgeAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

interface ELOLevel {
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  badgeIcon: string;
}

interface CategoryScore {
  category: string;
  score: number;
  level: ELOLevel;
}

interface QuizHistoryItem {
  date: Date;
  category: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface ProgressTrackingProps {
  username: string;
  overallScore: number;
  currentLevel: ELOLevel;
  nextLevel: ELOLevel;
  progressToNextLevel: number;
  categoryScores: CategoryScore[];
  quizHistory: QuizHistoryItem[];
  studyStreak: number;
  cardsReviewed: number;
  timeSpent: number; // in minutes
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  username,
  overallScore,
  currentLevel,
  nextLevel,
  progressToNextLevel,
  categoryScores,
  quizHistory,
  studyStreak,
  cardsReviewed,
  timeSpent,
}) => {
  // Prepare data for radar chart
  const radarData = {
    labels: categoryScores.map(cat => cat.category),
    datasets: [
      {
        label: 'ELO Score',
        data: categoryScores.map(cat => cat.score),
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(63, 81, 181, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(63, 81, 181, 1)',
      },
    ],
  };

  // Prepare data for line chart (last 10 quizzes)
  const recentQuizzes = quizHistory.slice(-10);
  const lineData = {
    labels: recentQuizzes.map(quiz => quiz.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Quiz Scores',
        data: recentQuizzes.map(quiz => quiz.score),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Progress Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* ELO Score Overview */}
        <Grid item xs={12} md={4}>
          <LevelCard>
            <BadgeAvatar src={`/badges/${currentLevel.badgeIcon}`} alt={currentLevel.name}>
              {/* Fallback if image doesn't load */}
              {currentLevel.name.charAt(0)}
            </BadgeAvatar>
            <Typography variant="h5" gutterBottom>
              {currentLevel.name}
            </Typography>
            <Typography variant="body2" paragraph>
              {currentLevel.description}
            </Typography>
            <Chip 
              label={`ELO Score: ${overallScore}`} 
              color="primary" 
              variant="outlined" 
              sx={{ bgcolor: 'background.paper', mb: 2 }}
            />
            <Box sx={{ px: 2 }}>
              <Typography variant="body2" align="left" sx={{ mb: 0.5 }}>
                Progress to {nextLevel.name}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressToNextLevel} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption">{currentLevel.minScore}</Typography>
                <Typography variant="caption">{nextLevel.minScore}</Typography>
              </Box>
            </Box>
          </LevelCard>
        </Grid>
        
        {/* Study Stats */}
        <Grid item xs={12} md={8}>
          <StatsCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Study Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {studyStreak}
                    </Typography>
                    <Typography variant="body2">Day Streak</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {cardsReviewed}
                    </Typography>
                    <Typography variant="body2">Cards Reviewed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {timeSpent}
                    </Typography>
                    <Typography variant="body2">Minutes Studied</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                ELO Tier Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(overallScore / 3000) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round((overallScore / 3000) * 100)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Progress toward Tier-1 AI CTO (3000+ points)
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        
        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <ProgressContainer>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <Radar data={radarData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              {categoryScores.map((category) => (
                <ListItem key={category.category}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {category.category.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={category.category} 
                    secondary={`${category.score} points - ${category.level.name}`} 
                  />
                  <Chip 
                    size="small"
                    label={category.level.name} 
                    color="primary" 
                    variant="outlined" 
                  />
                </ListItem>
              ))}
            </List>
          </ProgressContainer>
        </Grid>
        
        {/* Recent Quiz Results */}
        <Grid item xs={12} md={6}>
          <ProgressContainer>
            <Typography variant="h6" gutterBottom>
              Recent Quiz Results
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentQuizzes.map((quiz, index) => (
                <ListItem key={index} divider={index < recentQuizzes.length - 1}>
                  <ListItemText 
                    primary={`${quiz.category} - ${quiz.correctAnswers}/${quiz.totalQuestions} correct`} 
                    secondary={quiz.date.toLocaleDateString()}
                  />
                  <Chip 
                    size="small"
                    label={`${quiz.score}%`} 
                    color={quiz.score >= 70 ? "success" : quiz.score >= 50 ? "warning" : "error"} 
                  />
                </ListItem>
              ))}
            </List>
          </ProgressContainer>
        </Grid>
        
        {/* Improvement Suggestions */}
        <Grid item xs={12}>
          <ProgressContainer>
            <Typography variant="h6" gutterBottom>
              Improvement Suggestions
            </Typography>
            <Grid container spacing={2}>
              {categoryScores
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((category) => (
                  <Grid item xs={12} md={4} key={category.category}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Focus on {category.category}
                        </Typography>
                        <Typography variant="body2">
                          Your score of {category.score} in this category is lower than others. 
                          Spend more time studying flashcards in this area to improve your overall ELO.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </ProgressContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressTracking;
