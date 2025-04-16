# AI Flashcards Application README

## Overview

AI Flashcards is a comprehensive learning application designed to help you master AI, LLMs, and agent technologies to become a top-tier tech startup CTO. The application features hundreds of expert-crafted flashcards and quiz questions across key AI domains, with an advanced ELO scoring system that tracks your progress through 12 named tiers from "Novice Explorer" to "Tier-1 AI CTO".

## Features

- **Comprehensive Content**: 40+ flashcards and 48+ quiz questions covering AI Fundamentals, Large Language Models, AI Agents, and Tech CTO Skills
- **ELO Scoring System**: Dynamic scoring that adjusts based on question difficulty and your performance
- **Named Progression Tiers**: 12 achievement levels from beginner to expert with custom descriptions
- **Spaced Repetition**: Smart algorithm that prioritizes content you need to review
- **Performance Analytics**: Detailed statistics and progress tracking
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT-based user authentication

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd ai_flashcards/backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai_flashcards
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

2. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Initialize the database (first time only):
   ```
   node src/scripts/initEloLevels.js
   node src/scripts/importContent.js
   ```

3. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Usage Guide

### Registration and Login

Create an account to track your progress and ELO score. Your learning journey will be saved across sessions.

### Flashcards

- Browse flashcards by category
- Flip cards to reveal answers and explanations
- Mark cards as mastered, learning, or review
- Use spaced repetition to optimize your learning

### Quizzes

- Take quizzes by category or mixed topics
- Receive immediate feedback on your answers
- See detailed explanations for each question
- Track your score and ELO rating changes

### Progress Tracking

- View your current ELO score and level
- See your progression through the 12 tiers
- Analyze your performance statistics
- Identify areas for improvement

## ELO Scoring System

The application uses a sophisticated ELO scoring system adapted for educational purposes:

- **Starting Score**: 1000 points (AI Apprentice level)
- **Score Range**: 0 to 3000+ points
- **Difficulty Impact**: Harder questions affect your score more significantly
- **Performance Adjustment**: The system adapts based on your answer history

### Level Tiers

1. **Novice Explorer** (0-999): Just beginning your AI journey
2. **AI Apprentice** (1000-1199): Grasping basic AI concepts
3. **ML Practitioner** (1200-1399): Developing practical understanding of machine learning
4. **Deep Learning Enthusiast** (1400-1599): Advancing in neural networks and deep learning
5. **NLP Specialist** (1600-1799): Mastering language model concepts
6. **AI Systems Architect** (1800-1999): Designing and implementing AI systems
7. **Agent Engineer** (2000-2199): Building knowledge of AI agents and autonomous systems
8. **Technical AI Leader** (2200-2399): Combining technical expertise with leadership
9. **AI Startup Strategist** (2400-2599): Developing strategic vision for AI startups
10. **AI Innovation Director** (2600-2799): Leading AI innovation initiatives
11. **Senior AI Executive** (2800-2999): Mastering executive skills for AI leadership
12. **Tier-1 AI CTO** (3000+): Achieved mastery across AI technology, leadership, and strategy

## Deployment

See the [Deployment Guide](deployment_guide.md) for detailed instructions on deploying the application to production environments.

## Testing

Run the automated tests to verify the application functionality:

```
cd backend
node src/tests/apiTests.js
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, Node.js, and MongoDB
- Designed to help aspiring CTOs master AI technologies
- Created to provide a structured learning path for AI mastery
