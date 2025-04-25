import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  margin: '0 auto',
}));

const FormCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const ResultCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: '10px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

interface GeneratedQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  difficulty: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  explanation: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const QuestionGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>('3');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to sample categories if API fails
        setCategories([
          { id: '1', name: 'AI Fundamentals', description: 'Core concepts and principles of artificial intelligence' },
          { id: '2', name: 'Large Language Models', description: 'Concepts, architecture, and applications of LLMs' },
          { id: '3', name: 'AI Agents', description: 'Autonomous AI systems, planning, and decision-making' },
          { id: '4', name: 'Tech CTO Skills', description: 'Leadership, technical, and strategic skills for AI CTOs' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/v1/tests/openai/generate_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: parseInt(difficulty),
          category_id: category || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData); // Debug log

      // Extract the question data from the nested structure
      const questionData = responseData.data?.question || responseData.question;
      console.log('Question Data:', questionData); // Debug log

      if (questionData && typeof questionData === 'object') {
        const formattedQuestion = {
          id: Number(questionData.id) || 0,
          question: String(questionData.question || ''),
          option_a: String(questionData.option_a || ''),
          option_b: String(questionData.option_b || ''),
          option_c: String(questionData.option_c || ''),
          option_d: String(questionData.option_d || ''),
          correct_option: String(questionData.correct_option || ''),
          difficulty: Number(questionData.difficulty) || 0,
          category_id: String(questionData.category_id || ''),
          created_at: String(questionData.created_at || ''),
          updated_at: String(questionData.updated_at || ''),
          explanation: String(questionData.explanation || ''),
          category: {
            id: String(questionData.category?.id || ''),
            name: String(questionData.category?.name || '')
          }
        };
        console.log('Formatted Question:', formattedQuestion); // Debug log
        setGeneratedQuestion(formattedQuestion);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error generating question:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1976D2' }}>
        Generate Questions
      </Typography>

      <FormCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e: SelectChangeEvent) => setDifficulty(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <MenuItem key={level} value={level.toString()}>
                      Level {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Any Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                variant="contained"
                onClick={handleGenerate}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Question'}
              </StyledButton>
            </Grid>
          </Grid>
        </CardContent>
      </FormCard>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {generatedQuestion && (
        <ResultCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976D2' }}>
              Generated Question
            </Typography>
            <Typography variant="body1" paragraph>
              {generatedQuestion?.question}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: '#1976D2' }}>
              Options:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {[
                { label: 'A', value: generatedQuestion?.option_a },
                { label: 'B', value: generatedQuestion?.option_b },
                { label: 'C', value: generatedQuestion?.option_c },
                { label: 'D', value: generatedQuestion?.option_d }
              ].map((option) => (
                <Typography
                  key={option.label}
                  component="li"
                  sx={{
                    color: option.value === generatedQuestion?.correct_option ? '#4CAF50' : 'inherit',
                    fontWeight: option.value === generatedQuestion?.correct_option ? 'bold' : 'normal',
                  }}
                >
                  {option.label}. {option.value || ''}
                </Typography>
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: '#1976D2' }}>
              Explanation:
            </Typography>
            <Typography variant="body1" paragraph>
              {generatedQuestion?.explanation || 'No explanation available.'}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Category: {generatedQuestion?.category?.name || 'Unknown Category'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Difficulty: {generatedQuestion?.difficulty || 'Not specified'}
              </Typography>
            </Box>
          </CardContent>
        </ResultCard>
      )}
    </Container>
  );
};

export default QuestionGenerator; 