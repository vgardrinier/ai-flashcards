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

- **Frontend**: React with TypeScript, Material-UI, Chart.js
- **Backend**: Ruby on Rails API
- **Database**: PostgreSQL
- **Authentication**: JWT-based user authentication

## Project Structure

```
ai_flashcards/
├── frontend/              # React + TypeScript frontend
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── api/         # API integration
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets
├── rails_backend/        # Rails API backend
│   ├── app/             # Application code
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Database models
│   │   └── services/    # Business logic
│   └── config/          # Configuration files
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Ruby (v3.0+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   cd ai_flashcards/frontend
   npm install
   ```
3. Install backend dependencies:
   ```
   cd ../rails_backend
   bundle install
   ```

### Configuration

1. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:3001/api/v1
   ```

2. Configure the Rails backend:
   ```
   cd rails_backend
   cp config/database.yml.example config/database.yml
   # Edit database.yml with your PostgreSQL credentials
   ```

### Running the Application

1. Start the Rails backend:
   ```
   cd rails_backend
   rails server -p 3001
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

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

See the [Deployment Guide](DEPLOYMENT.md) for detailed instructions on deploying the application to production environments.

## Testing

Run the automated tests to verify the application functionality:

```
# Frontend tests
cd frontend
npm test

# Backend tests
cd rails_backend
bundle exec rspec
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, TypeScript, and Ruby on Rails
- Designed to help aspiring CTOs master AI technologies
- Created to provide a structured learning path for AI mastery
