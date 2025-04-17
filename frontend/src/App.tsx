import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, Typography, Button, Paper, CircularProgress, Alert, Snackbar, Grid } from '@mui/material';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { quizAPI } from './api';
import { eloAPI } from './api/eloAPI';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import ProgressTracking from './components/ProgressTracking';
import EloScoreDisplay from './components/EloScoreDisplay';
import EloLevelProgression from './components/EloLevelProgression';
import EloAnalytics from './components/EloAnalytics';
import ApiTest from './components/ApiTest';
import { RecentActivity, ELOLevel, Category } from './types';
import { QuizResults } from './types/api';
import { quizQuestions } from './data/quizQuestions';
import theme from './theme';
import Resources from './components/Resources';

// Verify the imported eloAPI
console.log('App component - Imported eloAPI:', {
  eloAPI,
  hasUpdateScore: 'updateScore' in eloAPI,
  updateScoreType: typeof eloAPI.updateScore
});

// Sample data for demonstration
const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'AI Fundamentals',
    description: 'Core concepts and principles of artificial intelligence',
    icon: 'ai_fundamentals.png',
    totalCards: 120,
    masteredCards: 45
  },
  {
    id: '2',
    name: 'Large Language Models',
    description: 'Concepts, architecture, and applications of LLMs',
    icon: 'llm.png',
    totalCards: 85,
    masteredCards: 20
  },
  {
    id: '3',
    name: 'AI Agents',
    description: 'Autonomous AI systems, planning, and decision-making',
    icon: 'ai_agents.png',
    totalCards: 65,
    masteredCards: 10
  },
  {
    id: '4',
    name: 'Tech CTO Skills',
    description: 'Leadership, technical, and strategic skills for AI CTOs',
    icon: 'cto_skills.png',
    totalCards: 90,
    masteredCards: 15
  }
];

const sampleRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'quiz',
    category: 'AI Fundamentals',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    details: 'Completed quiz with score 85%'
  },
  {
    id: '2',
    type: 'flashcard',
    category: 'Large Language Models',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    details: 'Reviewed 15 flashcards'
  },
  {
    id: '3',
    type: 'level_up',
    category: 'Overall',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    details: 'Reached AI Apprentice level!'
  },
  {
    id: '4',
    type: 'quiz',
    category: 'Tech CTO Skills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    details: 'Completed quiz with score 72%'
  }
];

const sampleELOLevels: ELOLevel[] = [
  {
    name: "Novice Explorer",
    minScore: 0,
    maxScore: 999,
    description: "Beginning your journey into AI concepts",
    badgeIcon: "🔍"
  },
  {
    name: "AI Apprentice",
    minScore: 1000,
    maxScore: 1249,
    description: "Learning the fundamentals of AI and machine learning",
    badgeIcon: "🌱"
  },
  {
    name: "Algorithm Adept",
    minScore: 1250,
    maxScore: 1499,
    description: "Mastering basic algorithms and neural networks",
    badgeIcon: "🧮"
  },
  {
    name: "Data Disciple",
    minScore: 1500,
    maxScore: 1749,
    description: "Developing expertise in data processing and analysis",
    badgeIcon: "📊"
  },
  {
    name: "ML Engineer",
    minScore: 1750,
    maxScore: 1999,
    description: "Building and optimizing machine learning models",
    badgeIcon: "⚙️"
  },
  {
    name: "LLM Specialist",
    minScore: 2000,
    maxScore: 2149,
    description: "Understanding the intricacies of large language models",
    badgeIcon: ""
  }
];

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

interface UserData {
  username: string;
  userId: number;
  eloScore: number | null;
  currentLevel: ELOLevel | null;
  nextLevel: ELOLevel | null;
  progressToNextLevel: number;
  studyStreak: number;
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [levels, setLevels] = useState<ELOLevel[]>([]);
  const [userData, setUserData] = useState<UserData>({
    username: 'AI_Learner',
    userId: 3,
    eloScore: null,
    currentLevel: null,
    nextLevel: null,
    progressToNextLevel: 0,
    studyStreak: 7,
  });

  // Fetch levels
  useEffect(() => {
    const fetchLevels = async () => {
      console.log('Starting to fetch levels...');
      try {
        const levelsResponse = await eloAPI.getLevels();
        console.log('Raw levels response:', levelsResponse);
        
        if (!levelsResponse.data) {
          console.error('No data in levels response');
          return;
        }

        // Handle the response data directly
        const levelsData = levelsResponse.data;
        console.log('Levels data to transform:', levelsData);
        
        const transformedLevels = levelsData.map((level: { 
          name: string; 
          min_score: number; 
          max_score: number; 
          description: string; 
          icon?: string; 
        }) => ({
          name: level.name,
          minScore: level.min_score,
          maxScore: level.max_score,
          description: level.description,
          badgeIcon: level.icon || '',
        }));

        console.log('Setting levels state with:', transformedLevels);
        setLevels(transformedLevels);

      } catch (error) {
        console.error('Error fetching levels:', error);
        // Fallback to sample levels if API fails
        console.log('Using sample levels as fallback');
        setLevels(sampleELOLevels);
      }
    };

    fetchLevels();
  }, []);

  // Fetch score and calculate levels when levels are available
  useEffect(() => {
    const fetchScore = async () => {
      console.log('Starting to fetch score with levels:', levels);
      try {
        const scoreResponse = await eloAPI.getScore(3);
        console.log('Raw score response:', scoreResponse);

        if (!scoreResponse.data) {
          console.error('No data in score response');
          return;
        }

        const currentScore = scoreResponse.data.score;
        console.log('Current score:', currentScore);
        console.log('Available levels for calculation:', levels);

        const currentLevel = getLevelForScore(currentScore);
        console.log('Calculated current level:', currentLevel);

        const nextLevel = getNextLevelForScore(currentScore);
        console.log('Calculated next level:', nextLevel);

        const progressToNextLevel = calculateProgressToNextLevel(currentScore);
        console.log('Calculated progress:', progressToNextLevel);

        console.log('Updating user data with:', {
          currentScore,
          currentLevel,
          nextLevel,
          progressToNextLevel
        });

        setUserData(prevData => ({
          ...prevData,
          eloScore: currentScore,
          currentLevel,
          nextLevel,
          progressToNextLevel,
        }));

      } catch (error) {
        console.error('Error fetching score:', error);
        // Fallback to a default score if API fails
        const defaultScore = 220;
        const currentLevel = getLevelForScore(defaultScore);
        const nextLevel = getNextLevelForScore(defaultScore);
        const progressToNextLevel = calculateProgressToNextLevel(defaultScore);

        console.log('Using fallback data:', {
          defaultScore,
          currentLevel,
          nextLevel,
          progressToNextLevel
        });

        setUserData(prevData => ({
          ...prevData,
          eloScore: defaultScore,
          currentLevel,
          nextLevel,
          progressToNextLevel,
        }));
      }
    };

    if (levels.length > 0) {
      console.log('Levels available, fetching score...');
      fetchScore();
    } else {
      console.log('No levels available yet, waiting...');
    }
  }, [levels]);

  // Helper function to get the appropriate level for a given score
  const getLevelForScore = (score: number): ELOLevel | null => {
    console.log('getLevelForScore called with:', score);
    console.log('Available levels:', levels);
    const foundLevel = levels.find(level => score >= level.minScore && score <= level.maxScore);
    console.log('Found level:', foundLevel);
    return foundLevel || null;
  };

  // Helper function to get the next level for a given score
  const getNextLevelForScore = (score: number): ELOLevel | null => {
    console.log('getNextLevelForScore called with:', score);
    const currentLevelIndex = levels.findIndex(level => score >= level.minScore && score <= level.maxScore);
    console.log('Current level index:', currentLevelIndex);
    const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;
    console.log('Next level:', nextLevel);
    return nextLevel;
  };

  // Helper function to calculate progress to next level
  const calculateProgressToNextLevel = (score: number): number => {
    const currentLevel = getLevelForScore(score);
    const nextLevel = getNextLevelForScore(score);
    
    if (!currentLevel || !nextLevel) return 0;
    if (currentLevel === nextLevel) return 100;
    
    const range = nextLevel.minScore - currentLevel.minScore;
    const progress = score - currentLevel.minScore;
    return Math.round((progress / range) * 100);
  };

  // Helper function to calculate points to next level
  const calculatePointsToNext = () => {
    if (!userData.nextLevel || !userData.eloScore) return null;
    return userData.nextLevel.minScore - userData.eloScore;
  };

  // Add debug logging for render conditions
  console.log('Render state:', {
    userData: {
      eloScore: userData.eloScore,
      currentLevel: userData.currentLevel,
      nextLevel: userData.nextLevel
    },
    levels: levels.length
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setDrawerOpen(false);
  };

  const onComplete = async (results: QuizResults) => {
    try {
      console.log('Quiz completed with results:', results);
      console.log('Current user data before update:', userData);
      
      // Get the current ELO score from the backend
      const currentScoreResponse = await eloAPI.getScore(3);
      console.log('Current score response:', currentScoreResponse);
      const currentScore = currentScoreResponse.data.score;
      console.log('Current ELO score from backend:', currentScore);
      
      // The backend automatically updates the ELO score for each question
      // We just need to get the latest score
      const response = await eloAPI.getScore(3);
      console.log('Updated ELO score response:', response);
      
      if (response.data && response.data.score !== undefined) {
        const updatedScore = response.data.score;
        console.log('New ELO score from backend:', updatedScore);
        
        // Update the user data state
        setUserData(prev => {
          const updated: UserData = {
            ...prev,
            eloScore: updatedScore,
            currentLevel: getLevelForScore(updatedScore),
            nextLevel: getNextLevelForScore(updatedScore),
            progressToNextLevel: calculateProgressToNextLevel(updatedScore)
          };
          console.log('Updated user data:', updated);
          return updated;
        });
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error updating ELO score:', error);
    }
  };

  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>
          {userData.username.charAt(0)}
        </Avatar>
        <Typography variant="h6">{userData.username}</Typography>
        <Typography variant="body2" color="text.secondary">
          {userData.currentLevel?.name}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('dashboard')} selected={currentPage === 'dashboard'}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('flashcards')} selected={currentPage === 'flashcards'}>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Flashcards" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('quiz')} selected={currentPage === 'quiz'}>
          <ListItemIcon>
            <QuizIcon />
          </ListItemIcon>
          <ListItemText primary="Quiz" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('progress')} selected={currentPage === 'progress'}>
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Progress" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('settings')} selected={currentPage === 'settings'}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                name="darkMode"
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </ListItem>
      </List>
    </Box>
  );

  // Render the appropriate component based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            username={userData.username}
            eloScore={userData.eloScore}
            currentLevel={userData.currentLevel}
            nextLevel={userData.nextLevel}
            progressToNextLevel={userData.progressToNextLevel}
            studyStreak={userData.studyStreak}
            onStartQuiz={() => handleNavigation('quiz')}
            levels={levels}
            userId={userData.userId}
          />
        );
      case 'flashcards':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Flashcards</Typography>
            <Flashcard
              id="sample-card"
              question="What is a neural network?"
              answer="A neural network is a machine learning model inspired by the human brain that consists of layers of interconnected nodes (neurons) that process and transform input data to produce an output."
              explanation="Neural networks are the foundation of deep learning and are used for tasks like image recognition, natural language processing, and more."
              category="AI Fundamentals"
              difficulty={3}
              tags={["Neural Networks", "Deep Learning", "AI Fundamentals"]}
              onNext={() => console.log('Next card')}
              onPrevious={() => console.log('Previous card')}
              onMarkKnown={(id) => console.log('Marked as known:', id)}
              onMarkUnknown={(id) => console.log('Marked as unknown:', id)}
            />
          </Box>
        );
      case 'quiz':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Quiz</Typography>
            <Quiz
              categoryId={1}
              userId={userData.userId}
              onComplete={onComplete}
              timed={true}
              timeLimit={60}
            />
          </Box>
        );
      case 'progress':
        return (
          <Box sx={{ p: 3 }}>
            <ProgressTracking
              username={userData.username}
              overallScore={userData.eloScore}
              currentLevel={userData.currentLevel}
              nextLevel={userData.nextLevel}
              progressToNextLevel={userData.progressToNextLevel}
              categoryScores={[
                { category: "AI Fundamentals", score: 1350, level: { name: "ML Practitioner", minScore: 1200, maxScore: 1399, description: "", badgeIcon: "" } },
                { category: "Large Language Models", score: 1100, level: { name: "AI Apprentice", minScore: 1000, maxScore: 1199, description: "", badgeIcon: "" } },
                { category: "AI Agents", score: 950, level: { name: "Novice Explorer", minScore: 0, maxScore: 999, description: "", badgeIcon: "" } },
                { category: "Tech CTO Skills", score: 1050, level: { name: "AI Apprentice", minScore: 1000, maxScore: 1199, description: "", badgeIcon: "" } }
              ]}
              quizHistory={[
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
              ]}
              studyStreak={userData.studyStreak}
              cardsReviewed={245}
              timeSpent={820}
            />
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Typography paragraph>
              Settings page content will go here.
            </Typography>
          </Box>
        );
      case 'api-test':
        return <ApiTest />;
      case 'resources':
        return <Resources />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Page Not Found</Typography>
            <Typography paragraph>
              The requested page could not be found.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                AI Flashcards
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button color="inherit" onClick={() => handleNavigation('dashboard')}>Dashboard</Button>
                <Button color="inherit" onClick={() => handleNavigation('progress')}>Progress</Button>
                <Button color="inherit" onClick={() => handleNavigation('flashcards')}>Flashcards</Button>
                <Button color="inherit" onClick={() => handleNavigation('settings')}>Settings</Button>
                <Button color="inherit" onClick={() => handleNavigation('resources')}>Resources</Button>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          {renderContent()}
        </Container>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default App;
