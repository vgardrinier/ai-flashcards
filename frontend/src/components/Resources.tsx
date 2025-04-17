import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Grid,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ResourcesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  margin: '0 auto',
}));

const ResourceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const resources = [
  {
    title: "Building AI Browser Agents",
    link: "https://learn.deeplearning.ai/courses/building-ai-browser-agents",
    description: "Learn how to build AI agents that can interact with web browsers, fill out forms, and navigate websites. This course covers Monte Carlo Tree Search and AgentQ methods for creating reliable web agents.",
    source: "DeepLearning.AI"
  },
  {
    title: "Vibe Coding 101 with Replit",
    link: "https://learn.deeplearning.ai/courses/vibe-coding-101-with-replit",
    description: "Master the art of AI-assisted coding using Replit's cloud environment. Learn how to leverage coding agents to build and deploy applications faster, with practical examples including an SEO analyzer and voting app.",
    source: "DeepLearning.AI"
  },
  {
    title: "AI 2027: A Scenario",
    link: "https://ai-2027.com/",
    description: "A detailed scenario exploring the potential impact of superhuman AI over the next decade. Based on trend extrapolations, expert feedback, and previous forecasting successes.",
    source: "AI 2027 Project"
  },
  {
    title: "Build a Large Language Model from Scratch",
    link: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
    description: "A comprehensive guide to understanding and building your own large language model. Covers the fundamentals of transformer architecture, training processes, and practical implementation.",
    source: "Manning Publications"
  }
];

const Resources: React.FC = () => {
  return (
    <ResourcesContainer>
      <Typography variant="h4" gutterBottom>
        Learning Resources
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore these resources to deepen your understanding of AI, machine learning, and modern development practices.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {resources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ResourceCard>
              <CardActionArea 
                component={Link} 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Source: {resource.source}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </ResourceCard>
          </Grid>
        ))}
      </Grid>
    </ResourcesContainer>
  );
};

export default Resources; 