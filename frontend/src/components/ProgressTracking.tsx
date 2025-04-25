import React, { useState, useEffect } from 'react';
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
  ListItemAvatar,
  CircularProgress
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
// Import APIs
import progressAPI from '../api/progress';

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
  date: Date | string;
  category: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface ProgressStats {
  studyStreak: number;
  cardsReviewed: number;
  timeSpent: number;
  categoryScores: CategoryScore[];
  quizHistory: QuizHistoryItem[];
}

interface ProgressTrackingProps {
  username: string;
  overallScore: number | null;
  currentLevel: ELOLevel | null;
  nextLevel: ELOLevel | null;
  progressToNextLevel: number;
  userId: number;
  // Following props are optional since we'll load them from API
  categoryScores?: CategoryScore[];
  quizHistory?: QuizHistoryItem[];
  studyStreak?: number;
  cardsReviewed?: number;
  timeSpent?: number;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  username,
  overallScore,
  currentLevel,
  nextLevel,
  progressToNextLevel,
  userId,
  // Use default props values if not provided
  categoryScores: initialCategoryScores = [],
  quizHistory: initialQuizHistory = [],
  studyStreak: initialStudyStreak = 0,
  cardsReviewed: initialCardsReviewed = 0,
  timeSpent: initialTimeSpent = 0,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for progress statistics
  const [stats, setStats] = useState<ProgressStats>({
    studyStreak: initialStudyStreak,
    cardsReviewed: initialCardsReviewed,
    timeSpent: initialTimeSpent,
    categoryScores: initialCategoryScores,
    quizHistory: initialQuizHistory
  });

  // Fetch progress statistics from the API with fallback to sample data
  useEffect(() => {
    // Flag to track if component is mounted
    let isMounted = true;
    
    const fetchProgressStats = async () => {
      try {
        console.log('Fetching progress stats for user ID:', userId);
        if (isMounted) setLoading(true);
        
        // Log the API URL being called
        console.log('API URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'}/progress/stats/${userId}`);
        
        const response = await progressAPI.getStats(userId);
        console.log('Progress stats API response:', response);
        
        // For API responses without a data wrapper (direct response)
        const statsData = response.data && response.data.data ? response.data.data : response.data;
        console.log('Stats data from API:', statsData);
        
        // Only update state if component is still mounted
        if (statsData && isMounted) {
          // Use type assertion to let TypeScript know the expected structure
          const typedData = statsData as {
            studyStreak?: number;
            cardsReviewed?: number;
            timeSpent?: number;
            categoryScores?: CategoryScore[];
            quizHistory?: any[];
          };
          
          // Convert date strings to Date objects for quiz history
          const quizHistory = typedData.quizHistory && typedData.quizHistory.length
            ? typedData.quizHistory.map((quiz: any) => ({
                ...quiz,
                date: new Date(quiz.date),
                category: quiz.category || "Unknown",
                score: Number(quiz.score) || 0,
                correctAnswers: Number(quiz.correctAnswers) || 0,
                totalQuestions: Number(quiz.totalQuestions) || 0
              }))
            : [];
          
          setStats({
            studyStreak: typedData.studyStreak || initialStudyStreak,
            cardsReviewed: typedData.cardsReviewed || initialCardsReviewed,
            timeSpent: typedData.timeSpent || initialTimeSpent,
            categoryScores: typedData.categoryScores || initialCategoryScores,
            quizHistory: quizHistory.length ? quizHistory : initialQuizHistory
          });
          
          if (isMounted) setLoading(false);
        } else if (isMounted) {
          console.error('Invalid response structure:', response);
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching progress stats:', error);
        if (isMounted) {
          setError('Failed to load progress data');
          setLoading(false);
          
          console.log('Using fallback sample data');
          
          // Sample data for demonstration (fallback)
          const sampleCategoryScores: CategoryScore[] = [
            { category: "AI Fundamentals", score: 1350, level: { name: "ML Practitioner", minScore: 1200, maxScore: 1399, description: "Building and applying models", badgeIcon: "ml_practitioner.png" } },
            { category: "Large Language Models", score: 1100, level: { name: "AI Apprentice", minScore: 1000, maxScore: 1199, description: "Learning the fundamentals", badgeIcon: "ai_apprentice.png" } },
            { category: "AI Agents", score: 950, level: { name: "Novice Explorer", minScore: 0, maxScore: 999, description: "Beginning your journey", badgeIcon: "novice_explorer.png" } },
            { category: "Tech CTO Skills", score: 1050, level: { name: "AI Apprentice", minScore: 1000, maxScore: 1199, description: "Learning the fundamentals", badgeIcon: "ai_apprentice.png" } }
          ];
          
          const sampleQuizHistory: QuizHistoryItem[] = [
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0), category: "AI Fundamentals", score: 85, correctAnswers: 17, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), category: "Large Language Models", score: 70, correctAnswers: 7, totalQuestions: 10 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), category: "Tech CTO Skills", score: 75, correctAnswers: 15, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), category: "AI Agents", score: 60, correctAnswers: 6, totalQuestions: 10 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), category: "AI Fundamentals", score: 80, correctAnswers: 16, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), category: "Large Language Models", score: 65, correctAnswers: 13, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), category: "Tech CTO Skills", score: 70, correctAnswers: 14, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), category: "AI Agents", score: 55, correctAnswers: 11, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), category: "AI Fundamentals", score: 75, correctAnswers: 15, totalQuestions: 20 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), category: "Large Language Models", score: 60, correctAnswers: 12, totalQuestions: 20 }
          ];
          
          // Set sample data if API fails
          setStats({
            studyStreak: 7,
            cardsReviewed: 245,
            timeSpent: 820,
            categoryScores: sampleCategoryScores,
            quizHistory: sampleQuizHistory
          });
        }
      }
    };

    fetchProgressStats();
    
    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  // Only include userId in dependency array to avoid constant re-fetching
  }, [userId]);

  if (loading || !overallScore || !currentLevel || !nextLevel) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading progress data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Prepare data for radar chart
  const radarData = {
    labels: stats.categoryScores.map(cat => cat.category),
    datasets: [
      {
        label: 'ELO Score',
        data: stats.categoryScores.map(cat => cat.score),
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
  const recentQuizzes = stats.quizHistory.slice(0, 10); // Already sorted newest first from API
  const lineData = {
    labels: recentQuizzes.map(quiz => 
      quiz.date instanceof Date 
        ? quiz.date.toLocaleDateString() 
        : new Date(quiz.date).toLocaleDateString()
    ),
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
                      {stats.studyStreak}
                    </Typography>
                    <Typography variant="body2">Day Streak</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats.cardsReviewed}
                    </Typography>
                    <Typography variant="body2">Cards Reviewed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats.timeSpent}
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
              {stats.categoryScores.map((category) => (
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
                    secondary={typeof quiz.date === 'string' 
                      ? new Date(quiz.date).toLocaleDateString() 
                      : quiz.date.toLocaleDateString()}
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
              {stats.categoryScores
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
