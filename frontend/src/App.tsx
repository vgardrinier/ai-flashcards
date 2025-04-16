import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Container,
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

// Import components
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import ProgressTracking from './components/ProgressTracking';

// Sample data for demonstration
const sampleCategories = [
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

const sampleRecentActivity = [
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

const sampleELOLevels = [
  {
    name: "Novice Explorer",
    minScore: 0,
    maxScore: 999,
    description: "Beginning the AI journey with foundational knowledge",
    badgeIcon: "novice_badge.png"
  },
  {
    name: "AI Apprentice",
    minScore: 1000,
    maxScore: 1199,
    description: "Building core understanding of AI concepts",
    badgeIcon: "apprentice_badge.png"
  },
  // Additional levels would be defined here
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
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

  // Sample user data
  const userData = {
    username: 'AI_Learner',
    eloScore: 1150,
    currentLevel: sampleELOLevels[1], // AI Apprentice
    nextLevel: {
      name: "ML Practitioner",
      minScore: 1200,
    },
    progressToNextLevel: 75, // 75% progress to next level
    studyStreak: 7,
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
          {userData.currentLevel.name}
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
            categories={sampleCategories}
            recentActivity={sampleRecentActivity}
            studyStreak={userData.studyStreak}
            onStartQuiz={(categoryId) => handleNavigation('quiz')}
            onReviewFlashcards={(categoryId) => handleNavigation('flashcards')}
            onViewProgress={() => handleNavigation('progress')}
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
              questions={[
                {
                  id: "q1",
                  question: "Which of the following is NOT a key component of a transformer architecture in LLMs?",
                  options: [
                    { id: "a", text: "Self-attention mechanism", isCorrect: false },
                    { id: "b", text: "Positional encoding", isCorrect: false },
                    { id: "c", text: "Convolutional layers", isCorrect: true },
                    { id: "d", text: "Feed-forward neural networks", isCorrect: false }
                  ],
                  explanation: "Transformer architectures primarily use self-attention mechanisms, positional encoding, and feed-forward neural networks. Convolutional layers are more commonly found in CNN architectures, not transformers.",
                  category: "Large Language Models",
                  difficulty: 4
                },
                {
                  id: "q2",
                  question: "What is the main advantage of ELO scoring systems?",
                  options: [
                    { id: "a", text: "They only track correct answers", isCorrect: false },
                    { id: "b", text: "They adjust based on the difficulty of questions", isCorrect: true },
                    { id: "c", text: "They don't require any calculations", isCorrect: false },
                    { id: "d", text: "They only work for multiple choice questions", isCorrect: false }
                  ],
                  explanation: "ELO scoring systems adjust scores based on the difficulty of questions or opponents. When you answer difficult questions correctly, you gain more points than answering easy questions correctly.",
                  category: "Tech CTO Skills",
                  difficulty: 3
                }
              ]}
              category="Mixed Categories"
              onComplete={(results) => console.log('Quiz completed:', results)}
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
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Flashcards
            </Typography>
            <Box>
              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {userData.username.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          {drawerContent}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: '100%',
            minHeight: '100vh',
            marginTop: '64px', // AppBar height
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
