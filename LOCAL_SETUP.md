# Local Setup Guide for AI Flashcards Application

This guide provides step-by-step instructions for running the AI Flashcards application locally without Docker or cloud services.

## Prerequisites

- Ruby 3.0.2+ and Rails 7.1.5+
- Node.js 16+ and npm
- PostgreSQL database server
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ai-flashcards.git
cd ai-flashcards
```

## Step 2: Set Up the Rails Backend

```bash
# Navigate to the backend directory
cd rails_backend

# Install Ruby dependencies
bundle install

# Configure the database
# Edit config/database.yml if needed to match your PostgreSQL setup

# Create and set up the database
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails server -p 3001
```

## Step 3: Set Up the React Frontend

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd ai-flashcards/frontend

# Install JavaScript dependencies
npm install

# Create a local environment file
echo "REACT_APP_API_URL=http://localhost:3001/api/v1" > .env.local

# Start the React development server
npm start
```

## Step 4: Access the Application

- The frontend will be available at: http://localhost:3000
- The backend API will be running at: http://localhost:3001/api/v1

## Troubleshooting

### PostgreSQL Issues

If you encounter database connection issues:

1. Ensure PostgreSQL is running:
   ```bash
   sudo service postgresql status
   ```

2. Create a PostgreSQL user if needed:
   ```bash
   sudo -u postgres psql -c "CREATE USER ubuntu WITH SUPERUSER PASSWORD 'password';"
   ```

3. Update database.yml with your credentials:
   ```yaml
   development:
     adapter: postgresql
     encoding: unicode
     pool: 5
     database: rails_backend_development
     username: your_username
     password: your_password
   ```

### Rails Server Issues

If the Rails server fails to start:

1. Check for port conflicts:
   ```bash
   lsof -i :3001
   ```

2. Kill any process using the port:
   ```bash
   kill -9 <PID>
   ```

3. Try a different port:
   ```bash
   rails server -p 3002
   ```
   (Remember to update the frontend .env.local file accordingly)

### React Frontend Issues

If the React frontend fails to connect to the backend:

1. Verify the API URL in .env.local
2. Ensure the Rails server is running
3. Check for CORS issues in the browser console

## Data Persistence

All your progress data is stored in your local PostgreSQL database. This includes:

- User accounts and authentication
- Flashcard progress and review history
- Quiz attempts and answers
- ELO scores and level progression

Your data will persist between sessions as long as you don't drop the database.
