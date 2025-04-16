// This file configures the connection between the React frontend and Rails backend
// It sets up the environment variables needed for deployment

module.exports = {
  // Production environment settings
  production: {
    // API URL for the Rails backend
    API_URL: 'https://ai-flashcards-api.onrender.com/api/v1',
    
    // Frontend URL
    FRONTEND_URL: 'https://ai-flashcards.onrender.com',
    
    // Database connection string (used by backend only)
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ai_flashcards_production',
    
    // JWT secret for authentication (used by backend only)
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-for-jwt',
    
    // Port settings
    PORT: process.env.PORT || 3000,
    
    // CORS settings
    CORS_ORIGINS: ['https://ai-flashcards.onrender.com', 'https://www.ai-flashcards.onrender.com']
  },
  
  // Development environment settings
  development: {
    // API URL for local development
    API_URL: 'http://localhost:3001/api/v1',
    
    // Frontend URL for local development
    FRONTEND_URL: 'http://localhost:3000',
    
    // Database connection string for local development
    DATABASE_URL: 'postgresql://ubuntu:password@localhost:5432/rails_backend_development',
    
    // JWT secret for local development
    JWT_SECRET: 'development-jwt-secret',
    
    // Port settings
    PORT: 3000,
    
    // CORS settings
    CORS_ORIGINS: ['http://localhost:3000']
  }
};
