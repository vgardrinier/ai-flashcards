// Component to display ELO history and analytics
import React from 'react';
import { Box, Typography, Paper, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Styled components
const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '8px',
  height: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const StatValue = styled(Typography)(({ theme, positive }) => ({
  fontWeight: 'bold',
  fontSize: '1.8rem',
  color: positive === undefined 
    ? theme.palette.primary.main 
    : positive 
      ? theme.palette.success.main 
      : theme.palette.error.main,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body2">
          <strong>Date:</strong> {new Date(label).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="primary">
          <strong>Score:</strong> {payload[0].value}
        </Typography>
        {payload[1] && (
          <Typography 
            variant="body2" 
            color={payload[1].value >= 0 ? 'success.main' : 'error.main'}
          >
            <strong>Change:</strong> {payload[1].value > 0 ? '+' : ''}{payload[1].value}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

const EloAnalytics = ({ history, levels }) => {
  const theme = useTheme();
  
  // Process history data for chart
  const chartData = history.map(entry => ({
    date: new Date(entry.date).getTime(),
    score: entry.score,
    change: entry.change
  }));
  
  // Calculate stats
  const totalQuizzes = history.length;
  const positiveChanges = history.filter(entry => entry.change > 0).length;
  const negativeChanges = history.filter(entry => entry.change < 0).length;
  const biggestGain = Math.max(...history.map(entry => entry.change), 0);
  const averageChange = history.length > 0 
    ? Math.round(history.reduce((sum, entry) => sum + entry.change, 0) / history.length) 
    : 0;
  
  // Generate reference lines for level thresholds
  const levelThresholds = levels
    .filter(level => level.min_score > 0)
    .map(level => ({
      y: level.min_score,
      name: level.name
    }));
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ELO Score History
      </Typography>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              scale="time"
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Level threshold reference lines */}
            {levelThresholds.map((threshold, index) => (
              <ReferenceLine 
                key={index}
                y={threshold.y} 
                stroke={theme.palette.grey[400]}
                strokeDasharray="3 3"
                label={{ 
                  value: threshold.name, 
                  position: 'insideTopRight',
                  fill: theme.palette.text.secondary,
                  fontSize: 10
                }}
              />
            ))}
            
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={theme.palette.primary.main} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <Typography variant="h6" gutterBottom>
        Performance Stats
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <StatCard>
            <Typography variant="body2" color="textSecondary">
              Total Quizzes
            </Typography>
            <StatValue>{totalQuizzes}</StatValue>
          </StatCard>
        </Grid>
        
        <Grid item xs={6} sm={4}>
          <StatCard>
            <Typography variant="body2" color="textSecondary">
              Average Change
            </Typography>
            <StatValue positive={averageChange > 0}>
              {averageChange > 0 ? '+' : ''}{averageChange}
            </StatValue>
          </StatCard>
        </Grid>
        
        <Grid item xs={6} sm={4}>
          <StatCard>
            <Typography variant="body2" color="textSecondary">
              Biggest Gain
            </Typography>
            <StatValue positive={true}>+{biggestGain}</StatValue>
          </StatCard>
        </Grid>
        
        <Grid item xs={6} sm={6}>
          <StatCard>
            <Typography variant="body2" color="textSecondary">
              Improved Quizzes
            </Typography>
            <StatValue positive={true}>
              {positiveChanges} ({totalQuizzes > 0 ? Math.round((positiveChanges / totalQuizzes) * 100) : 0}%)
            </StatValue>
          </StatCard>
        </Grid>
        
        <Grid item xs={6} sm={6}>
          <StatCard>
            <Typography variant="body2" color="textSecondary">
              Challenging Quizzes
            </Typography>
            <StatValue positive={false}>
              {negativeChanges} ({totalQuizzes > 0 ? Math.round((negativeChanges / totalQuizzes) * 100) : 0}%)
            </StatValue>
          </StatCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EloAnalytics;
