// Component to display ELO history and analytics
import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface HistoryEntry {
  date: string;
  score: number;
  change: number;
}

interface EloAnalyticsProps {
  history: HistoryEntry[];
  levels: Array<{
    name: string;
    minScore: number;
  }>;
}

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(3),
  background: theme.palette.background.paper,
}));

const EloAnalytics: React.FC<EloAnalyticsProps> = ({ history, levels }) => {
  const theme = useTheme();

  // Simple data transformation - just sort by date
  const chartData = [...history].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Find score range for y-axis
  const scores = chartData.map(entry => entry.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const yAxisMin = Math.floor(minScore / 100) * 100;
  const yAxisMax = Math.ceil(maxScore / 100) * 100;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        ELO Progress
      </Typography>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[yAxisMin, yAxisMax]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === 'score') return ['Score', value];
                if (name === 'change') return ['Change', `${value >= 0 ? '+' : ''}${value}`];
                return [name, value];
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Box>
  );
};

export default EloAnalytics;
