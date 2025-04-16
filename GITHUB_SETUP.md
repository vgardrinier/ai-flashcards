# GitHub Repository Setup Guide for AI Flashcards Application

This guide provides step-by-step instructions for adding the AI Flashcards application to your GitHub account.

## Prerequisites

- GitHub account
- Git installed on your local machine
- AI Flashcards application code on your local machine

## Step 1: Create a New Repository on GitHub

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Fill in the repository details:
   - Repository name: `ai-flashcards` (or any name you prefer)
   - Description: "AI Flashcards application for learning AI, LLMs, and agents with ELO scoring system"
   - Visibility: Public or Private (your choice)
   - Do NOT initialize with README, .gitignore, or license (we'll push the existing code)
4. Click "Create repository"

## Step 2: Initialize and Push the Local Repository

Open your terminal and navigate to the AI Flashcards project directory:

```bash
# Navigate to your project directory
cd ai-flashcards

# Initialize git repository (if not already done)
git init

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit: AI Flashcards application with PostgreSQL and Rails"

# Add the GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ai-flashcards.git

# Push the code to GitHub
git push -u origin main
```

Note: If your default branch is "master" instead of "main", use:
```bash
git push -u origin master
```

## Step 3: Verify the Repository

1. Visit `https://github.com/YOUR_USERNAME/ai-flashcards` in your browser
2. Confirm that all directories and files have been uploaded successfully
3. Check that the repository structure matches your local project

## Step 4: Enhance Your Repository (Optional)

Consider adding these enhancements to make your repository more professional:

1. **Update README.md**:
   - Add a project description
   - Include screenshots of the application
   - List features and technologies used
   - Add setup and usage instructions

2. **Add License**:
   - Click "Add file" > "Create new file"
   - Name the file "LICENSE"
   - Click "Choose a license template" and select an appropriate license

3. **Add .gitignore**:
   - Create a `.gitignore` file to exclude unnecessary files
   - Include patterns for Ruby, Rails, React, and Node.js

4. **Set Up GitHub Pages**:
   - Go to repository Settings > Pages
   - Configure GitHub Pages to serve your documentation

## Step 5: Share Your Repository

Now that your AI Flashcards application is on GitHub, you can:

1. Share the repository URL with others
2. Accept contributions through pull requests
3. Track issues and feature requests
4. Collaborate with other developers

Your repository URL will be: `https://github.com/YOUR_USERNAME/ai-flashcards`

## Troubleshooting

### Authentication Issues

If you encounter authentication issues when pushing to GitHub:

1. Ensure you've configured your Git credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Use a personal access token instead of password:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with appropriate permissions
   - Use this token instead of your password when prompted

### Large File Issues

If you have large files that exceed GitHub's file size limits:

1. Consider using Git LFS (Large File Storage)
2. Or add large files to .gitignore to exclude them from the repository
