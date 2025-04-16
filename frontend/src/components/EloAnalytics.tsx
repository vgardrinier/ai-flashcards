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
import { ELOLevel } from '../types';

interface HistoryEntry {
  date: string;
  score: number;
  change: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface EloAnalyticsProps {
  history: HistoryEntry[];
  levels: ELOLevel[];
}

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

const StatValue = styled(Typography)<{ positive?: boolean }>(({ theme, positive }) => ({
  fontWeight: 'bold',
  fontSize: '1.8rem',
  color: positive === undefined 
    ? theme.palette.text.primary 
    : positive 
      ? theme.palette.success.main 
      : theme.palette.error.main
}));

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
      <Typography variant="body2">{new Date(label).toLocaleDateString()}</Typography>
      <Typography variant="body2" color="primary">
        Score: {payload[0].value}
      </Typography>
      <Typography variant="body2" color={payload[1].value > 0 ? 'success.main' : 'error.main'}>
        Change: {payload[1].value > 0 ? '+' : ''}{payload[1].value}
      </Typography>
    </Box>
  );
};

const EloAnalytics: React.FC<EloAnalyticsProps> = ({ history, levels }) => {
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
  
  // Add reference lines for level thresholds
  const levelLines = levels.map(level => (
    <ReferenceLine
      key={level.name}
      y={level.minScore}
      stroke={theme.palette.primary.main}
      strokeDasharray="3 3"
      label={{
        value: level.name,
        position: 'right',
        fill: theme.palette.primary.main
      }}
    />
  ));
  
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
            {levelLines}
            
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
