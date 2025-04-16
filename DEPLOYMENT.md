# AI Flashcards Deployment Guide

This guide provides instructions for deploying the AI Flashcards application with permanent data storage using PostgreSQL and Rails.

## Architecture Overview

The application consists of two main components:
1. **React Frontend**: User interface with flashcards, quizzes, and progress tracking
2. **Rails API Backend**: RESTful API with PostgreSQL database for permanent data storage

## Prerequisites

- PostgreSQL database server
- Ruby 3.0.2+ and Rails 7.1.5+
- Node.js 16+ and npm/yarn
- Git

## Backend Deployment

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-flashcards.git
cd ai-flashcards/rails_backend
```

### 2. Configure database

Edit `config/database.yml` to match your PostgreSQL credentials:

```yaml
production:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: ai_flashcards_production
  username: <%= ENV['DATABASE_USERNAME'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] %>
```

### 3. Install dependencies

```bash
bundle install
```

### 4. Set up the database

```bash
rails db:create
rails db:migrate
rails db:seed
```

### 5. Start the server

```bash
rails server -e production
```

## Frontend Deployment

### 1. Navigate to frontend directory

```bash
cd ../frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API endpoint

Create a `.env.production` file:

```
REACT_APP_API_URL=https://your-backend-api-url.com/api/v1
```

### 4. Build for production

```bash
npm run build
```

### 5. Deploy the build folder

Upload the contents of the `build` folder to your web server or hosting service.

## Cloud Deployment Options

### Render.com (Recommended)

1. Create a PostgreSQL database service
2. Create a web service for the Rails backend
   - Build command: `bundle install && rails db:migrate && rails db:seed`
   - Start command: `rails server -b 0.0.0.0`
3. Create a static site for the React frontend
   - Build command: `npm install && npm run build`
   - Publish directory: `build`

### Heroku

1. Create a new Heroku app for the backend
   ```bash
   heroku create ai-flashcards-api
   heroku addons:create heroku-postgresql:hobby-dev
   git subtree push --prefix rails_backend heroku main
   heroku run rails db:migrate
   heroku run rails db:seed
   ```

2. Create a new Heroku app for the frontend
   ```bash
   heroku create ai-flashcards-frontend
   git subtree push --prefix frontend heroku-frontend main
   ```

## Environment Variables

Set these environment variables for the backend:
- `DATABASE_URL`: PostgreSQL connection string
- `RAILS_MASTER_KEY`: Secret key for Rails credentials
- `JWT_SECRET`: Secret key for JWT authentication

Set these environment variables for the frontend:
- `REACT_APP_API_URL`: URL of the backend API

## Verifying Deployment

1. Visit your frontend URL
2. Create a new account
3. Try answering some quiz questions
4. Verify that your ELO score updates and progress is saved
5. Log out and log back in to confirm data persistence

## Troubleshooting

- **CORS issues**: Ensure the backend has proper CORS configuration
- **Database connection errors**: Verify database credentials and connection string
- **Authentication failures**: Check JWT secret configuration
- **Missing assets**: Ensure all frontend assets are properly built and deployed
