# AI Flashcards Application Deployment Guide

This document provides instructions for deploying the AI Flashcards application.

## Prerequisites

- Ruby 2.7.8
- PostgreSQL 12+
- Node.js 16+
- npm or yarn

## Backend Deployment

1. Navigate to the backend directory:
   ```
   cd /path/to/ai_flashcards/rails_backend
   ```

2. Install dependencies:
   ```
   bundle install
   ```

3. Configure environment variables:
   ```
   # Create master.key or use existing one to decrypt credentials.yml.enc
   # Set the following in Rails credentials
   RAILS_MASTER_KEY=your_master_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Setup the database:
   ```
   RAILS_ENV=production rails db:create
   RAILS_ENV=production rails db:migrate
   RAILS_ENV=production rails db:seed
   ```

5. Precompile assets (if needed):
   ```
   RAILS_ENV=production rails assets:precompile
   ```

6. Start the server:
   ```
   RAILS_ENV=production rails s -p 3001
   ```

## Frontend Deployment

1. Navigate to the frontend directory:
   ```
   cd /path/to/ai_flashcards/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api/v1
   ```

4. Build the production version:
   ```
   npm run build
   ```

5. Serve the built files:
   ```
   npx serve -s build
   ```

6. Alternatively, deploy to a static hosting service:
   ```
   # For Netlify
   netlify deploy --prod
   
   # For Vercel
   vercel --prod
   ```

## Docker Deployment (Alternative)

1. Create a `docker-compose.yml` file in the root directory:
   ```yaml
   version: '3'
   services:
     postgres:
       image: postgres:12
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
         - POSTGRES_DB=ai_flashcards_production
       restart: always

     rails_backend:
       build: ./rails_backend
       ports:
         - "3001:3001"
       depends_on:
         - postgres
       environment:
         - RAILS_ENV=production
         - DATABASE_URL=postgres://postgres:password@postgres:5432/ai_flashcards_production
         - RAILS_MASTER_KEY=${RAILS_MASTER_KEY}
         - OPENAI_API_KEY=${OPENAI_API_KEY}
       restart: always

     frontend:
       build: ./frontend
       ports:
         - "3000:80"
       depends_on:
         - rails_backend
       environment:
         - REACT_APP_API_URL=http://localhost:3001/api/v1
       restart: always

   volumes:
     postgres_data:
   ```

2. Create a `Dockerfile` in the rails_backend directory:
   ```dockerfile
   FROM ruby:2.7.8-alpine

   # Install dependencies
   RUN apk add --update --no-cache \
       build-base \
       postgresql-dev \
       tzdata \
       nodejs \
       yarn

   WORKDIR /app

   # Install gems
   COPY Gemfile Gemfile.lock ./
   RUN bundle install --jobs 4 --retry 3

   # Copy application code
   COPY . .

   # Precompile assets
   RUN bundle exec rails assets:precompile

   # Expose port
   EXPOSE 3001

   # Start the server
   CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
   ```

3. Create a `Dockerfile` in the frontend directory:
   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   # Add nginx configuration for SPA routing
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. Deploy with Docker Compose:
   ```
   # Export required environment variables
   export RAILS_MASTER_KEY=your_master_key
   export OPENAI_API_KEY=your_openai_api_key
   
   # Start containers
   docker-compose up -d
   
   # Initialize database (first time only)
   docker-compose exec rails_backend rails db:create db:migrate db:seed
   ```

## Public Deployment

For public deployment, consider using:

1. **Backend**: Heroku, AWS Elastic Beanstalk, or Digital Ocean App Platform
2. **Frontend**: Netlify, Vercel, or GitHub Pages
3. **Database**: MongoDB Atlas (cloud database)

Update the environment variables to point to your production database and API endpoints.

## Post-Deployment Verification

1. Run the API tests to verify the deployment:
   ```
   cd /home/ubuntu/ai_flashcards/backend
   node src/tests/apiTests.js
   ```

2. Manually test the application by:
   - Creating a new user account
   - Browsing flashcards
   - Taking quizzes
   - Checking ELO score updates
   - Verifying level progression

## Troubleshooting

- **Database Connection Issues**: Verify MongoDB is running and the connection string is correct
- **API Errors**: Check backend logs for detailed error messages
- **Frontend Not Loading**: Ensure the API URL is correctly set in the frontend environment
- **CORS Errors**: Verify the backend has proper CORS configuration for your frontend domain
