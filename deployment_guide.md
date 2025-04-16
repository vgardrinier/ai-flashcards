# AI Flashcards Application Deployment Guide

This document provides instructions for deploying the AI Flashcards application.

## Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

## Backend Deployment

1. Navigate to the backend directory:
   ```
   cd /home/ubuntu/ai_flashcards/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai_flashcards
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

4. Initialize the database with ELO levels:
   ```
   node src/scripts/initEloLevels.js
   ```

5. Import flashcards and quiz questions:
   ```
   node src/scripts/importContent.js
   ```

6. Start the server:
   ```
   npm start
   ```

## Frontend Deployment

1. Navigate to the frontend directory:
   ```
   cd /home/ubuntu/ai_flashcards/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Build the production version:
   ```
   npm run build
   ```

5. Serve the built files:
   ```
   npx serve -s build
   ```

## Docker Deployment (Alternative)

1. Create a `docker-compose.yml` file in the root directory:
   ```yaml
   version: '3'
   services:
     mongodb:
       image: mongo:4.4
       ports:
         - "27017:27017"
       volumes:
         - mongodb_data:/data/db
       restart: always

     backend:
       build: ./backend
       ports:
         - "5000:5000"
       depends_on:
         - mongodb
       environment:
         - PORT=5000
         - MONGO_URI=mongodb://mongodb:27017/ai_flashcards
         - JWT_SECRET=your_jwt_secret_key
         - NODE_ENV=production
       restart: always

     frontend:
       build: ./frontend
       ports:
         - "3000:80"
       depends_on:
         - backend
       environment:
         - REACT_APP_API_URL=http://localhost:5000/api
       restart: always

   volumes:
     mongodb_data:
   ```

2. Create a `Dockerfile` in the backend directory:
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
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
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. Deploy with Docker Compose:
   ```
   docker-compose up -d
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
