import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Avatar,
  LinearProgress,
  Chip,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { ELOLevel, Category, RecentActivity } from '../types';

const WelcomeBanner = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundImage: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
  color: theme.palette.common.white,
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
}));

interface DashboardProps {
  username: string;
  eloScore: number;
  currentLevel: ELOLevel;
  nextLevel: ELOLevel;
  progressToNextLevel: number;
  categories: Category[];
  recentActivity: RecentActivity[];
  studyStreak: number;
  onStartQuiz: (categoryId?: string) => void;
  onReviewFlashcards: (categoryId?: string) => void;
  onViewProgress: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  username,
  eloScore,
  currentLevel,
  nextLevel,
  progressToNextLevel,
  categories,
  recentActivity,
  studyStreak,
  onStartQuiz,
  onReviewFlashcards,
  onViewProgress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <QuizIcon color="primary" />;
      case 'flashcard':
        return <SchoolIcon color="secondary" />;
      case 'level_up':
        return <EmojiEventsIcon sx={{ color: 'gold' }} />;
      default:
        return <TimelineIcon />;
    }
  };

  const formatActivityDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Container maxWidth="lg">
      <WelcomeBanner elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {username}!
            </Typography>
            <Typography variant="subtitle1">
              Continue your journey to becoming a tier-1 AI startup CTO.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FireIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {studyStreak} Day Streak
            </Typography>
          </Box>
        </Box>
      </WelcomeBanner>

      <Grid container spacing={3}>
        {/* ELO Score and Level */}
        <Grid item xs={12} md={4}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={`/badges/${currentLevel.badgeIcon}`}
                alt={currentLevel.name}
                sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
              >
                {currentLevel.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {currentLevel.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {currentLevel.description}
              </Typography>
              <Chip 
                label={`ELO Score: ${eloScore}`} 
                color="primary" 
                sx={{ mb: 2 }}
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
                  <Typography variant="caption">Current</Typography>
                  <Typography variant="caption">{nextLevel.minScore}</Typography>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <StatsCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ActionButton 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      startIcon={<QuizIcon />}
                      onClick={() => onStartQuiz(selectedCategory || undefined)}
                    >
                      Start Quiz
                    </ActionButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ActionButton 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                      startIcon={<SchoolIcon />}
                      onClick={() => onReviewFlashcards(selectedCategory || undefined)}
                    >
                      Review Flashcards
                    </ActionButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ActionButton 
                      variant="outlined" 
                      color="secondary" 
                      fullWidth
                      startIcon={<TimelineIcon />}
                      onClick={onViewProgress}
                    >
                      View Progress
                    </ActionButton>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Daily Goal
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={65} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    65%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                13/20 cards reviewed today
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Category Selection */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Study Categories
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <CategoryCard 
                  onClick={() => handleCategorySelect(category.id)}
                  variant={selectedCategory === category.id ? "elevation" : "outlined"}
                  elevation={selectedCategory === category.id ? 8 : 1}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Avatar 
                        src={`/icons/${category.icon}`}
                        alt={category.name}
                        sx={{ bgcolor: 'primary.light', mb: 1 }}
                      >
                        {category.name.charAt(0)}
                      </Avatar>
                      <Chip 
                        size="small"
                        label={`${category.masteredCards}/${category.totalCards}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(category.masteredCards / category.totalCards) * 100} 
                      sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemIcon>
                    {getActivityIcon(activity.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={activity.details} 
                    secondary={`${activity.category} • ${formatActivityDate(activity.date)}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recommended for You
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Review Neural Networks" 
                  secondary="You have 8 cards due for review in this topic" 
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <QuizIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Take LLM Architecture Quiz" 
                  secondary="Boost your ELO score in this category" 
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <TimelineIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Explore AI Agents" 
                  secondary="This is your lowest scoring category" 
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <EmojiEventsIcon sx={{ color: 'gold' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Challenge: Tech CTO Skills" 
                  secondary="Only 200 points away from next level!" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
