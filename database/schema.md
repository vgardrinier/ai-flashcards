# AI Flashcards Application Database Schema

## Overview
This document outlines the database schema for the AI Flashcards application. The application uses MongoDB for its flexible schema design, which is ideal for the varied content types in our flashcards system.

## Collections

### Users
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password_hash": "String",
  "created_at": "Date",
  "last_login": "Date",
  "preferences": {
    "dark_mode": "Boolean",
    "daily_goal": "Number",
    "notification_settings": "Object"
  }
}
```

### Categories
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "parent_category_id": "ObjectId (optional)",
  "icon": "String",
  "order": "Number"
}
```

### Flashcards
```json
{
  "_id": "ObjectId",
  "question": "String",
  "answer": "String",
  "explanation": "String",
  "category_id": "ObjectId",
  "subcategory_id": "ObjectId (optional)",
  "difficulty": "Number (1-5)",
  "tags": ["String"],
  "created_at": "Date",
  "updated_at": "Date",
  "source": "String",
  "media": {
    "type": "String (image, code, diagram)",
    "url": "String"
  }
}
```

### QuizQuestions
```json
{
  "_id": "ObjectId",
  "question": "String",
  "options": [
    {
      "text": "String",
      "is_correct": "Boolean"
    }
  ],
  "explanation": "String",
  "category_id": "ObjectId",
  "subcategory_id": "ObjectId (optional)",
  "difficulty": "Number (1-5)",
  "tags": ["String"],
  "related_flashcard_id": "ObjectId",
  "created_at": "Date",
  "updated_at": "Date"
}
```

### UserProgress
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "flashcard_id": "ObjectId",
  "status": "String (new, learning, reviewing, mastered)",
  "times_reviewed": "Number",
  "times_correct": "Number",
  "times_incorrect": "Number",
  "last_reviewed": "Date",
  "next_review": "Date",
  "ease_factor": "Number",
  "interval": "Number (days)"
}
```

### QuizSessions
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "start_time": "Date",
  "end_time": "Date",
  "category_id": "ObjectId (optional)",
  "mode": "String (timed, untimed, category, random)",
  "questions": [
    {
      "question_id": "ObjectId",
      "user_answer": "String",
      "is_correct": "Boolean",
      "time_taken": "Number (seconds)"
    }
  ],
  "score": "Number",
  "total_questions": "Number",
  "correct_answers": "Number"
}
```

### ELOScores
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "category_id": "ObjectId",
  "score": "Number",
  "level_name": "String",
  "history": [
    {
      "date": "Date",
      "score": "Number",
      "change": "Number",
      "quiz_session_id": "ObjectId"
    }
  ],
  "updated_at": "Date"
}
```

### ELOLevels
```json
{
  "_id": "ObjectId",
  "min_score": "Number",
  "max_score": "Number",
  "name": "String",
  "description": "String",
  "badge_icon": "String"
}
```

## ELO Level Tiers
The application will use the following named tiers for ELO scores to track progress toward becoming a tier-1 CTO of an AI startup:

1. **Novice Explorer** (0-999)
   - Beginning the AI journey with foundational knowledge

2. **AI Apprentice** (1000-1199)
   - Building core understanding of AI concepts

3. **ML Practitioner** (1200-1399)
   - Applying machine learning principles effectively

4. **Neural Navigator** (1400-1599)
   - Navigating complex neural network architectures

5. **LLM Specialist** (1600-1799)
   - Mastering large language model concepts and applications

6. **Agent Architect** (1800-1999)
   - Designing sophisticated AI agent systems

7. **AI Strategy Director** (2000-2199)
   - Developing strategic AI implementation plans

8. **Technical Visionary** (2200-2399)
   - Creating forward-thinking AI technical roadmaps

9. **Innovation Leader** (2400-2599)
   - Leading breakthrough AI innovations

10. **Startup CTO Candidate** (2600-2799)
    - Demonstrating skills comparable to AI startup CTOs

11. **Elite AI Executive** (2800-2999)
    - Exhibiting exceptional AI leadership capabilities

12. **Tier-1 AI CTO** (3000+)
    - Achieving mastery equivalent to top AI startup CTOs

## Relationships

1. **Users to UserProgress**: One-to-many (one user has progress records for many flashcards)
2. **Users to QuizSessions**: One-to-many (one user can have many quiz sessions)
3. **Users to ELOScores**: One-to-many (one user has ELO scores for multiple categories)
4. **Categories to Flashcards**: One-to-many (one category contains many flashcards)
5. **Categories to QuizQuestions**: One-to-many (one category contains many quiz questions)
6. **Flashcards to QuizQuestions**: One-to-many (one flashcard can be related to multiple quiz questions)
7. **ELOLevels to ELOScores**: Many-to-many (scores fall into level ranges)

## Indexes

1. User email (unique)
2. Category name
3. Flashcard tags
4. UserProgress user_id + flashcard_id (compound)
5. ELOScores user_id + category_id (compound)
6. QuizSessions user_id + start_time (compound)

## Data Flow

1. **Learning Flow**:
   - User selects a category
   - System retrieves flashcards based on user progress
   - User reviews flashcards
   - System updates UserProgress

2. **Quiz Flow**:
   - User starts a quiz session
   - System selects questions based on category and difficulty
   - User answers questions
   - System records results in QuizSessions
   - System updates ELOScores based on performance

3. **Progress Tracking**:
   - System analyzes UserProgress to recommend study areas
   - System uses ELOScores to determine user level in each category
   - System provides visual feedback on progress toward becoming a tier-1 CTO

## Database Initialization
The database will be initialized with:
1. Core categories based on research (AI Fundamentals, LLMs, AI Agents, CTO Skills)
2. ELO level tiers with appropriate score ranges and names
3. Initial set of flashcards and quiz questions generated from research data
