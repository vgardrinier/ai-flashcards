class Api::V1::FlashcardReviewsController < ApplicationController
  before_action :authenticate_user
  
  # GET /api/v1/flashcard_reviews/due
  # Returns flashcards due for review today, paginated
  def due
    # Find user progresses with flashcards due for review
    query = UserProgress.includes(:flashcard)
                        .where(user: current_user)
                        .where('next_review <= ?', Time.current)
                        .order(:next_review)
    
    # Apply optional category filter
    if params[:category_id].present?
      query = query.joins(:flashcard).where(flashcards: { category_id: params[:category_id] })
    end
    
    # Apply pagination
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 20).to_i
    
    # Get the total count for pagination metadata
    total_count = query.count
    
    # Get the paginated results
    due_progresses = query.limit(per_page).offset((page - 1) * per_page)
    
    # Format the response
    render json: {
      flashcards: due_progresses.map { |progress| 
        flashcard = progress.flashcard
        {
          id: flashcard.id,
          question: flashcard.question,
          answer: flashcard.answer,
          explanation: flashcard.explanation,
          category: flashcard.category.name,
          times_reviewed: progress.times_reviewed,
          last_reviewed: progress.last_reviewed,
          user_progress_id: progress.id
        }
      },
      meta: {
        total_count: total_count,
        current_page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end
  
  # GET /api/v1/flashcard_reviews/new
  # Returns flashcards that haven't been reviewed yet, paginated
  def new
    # Find flashcards that don't have a user_progress for this user
    reviewed_flashcard_ids = current_user.user_progresses.pluck(:flashcard_id)
    
    query = Flashcard.includes(:category)
                    .where.not(id: reviewed_flashcard_ids)
    
    # Apply optional category filter
    if params[:category_id].present?
      query = query.where(category_id: params[:category_id])
    end
    
    # Apply pagination
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 20).to_i
    
    # Get the total count for pagination metadata
    total_count = query.count
    
    # Get the paginated results
    new_flashcards = query.order(:id).limit(per_page).offset((page - 1) * per_page)
    
    # Format the response
    render json: {
      flashcards: new_flashcards.map { |flashcard| 
        {
          id: flashcard.id,
          question: flashcard.question,
          answer: flashcard.answer,
          explanation: flashcard.explanation,
          category: flashcard.category.name,
          new: true
        }
      },
      meta: {
        total_count: total_count,
        current_page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end
  
  # POST /api/v1/flashcard_reviews
  # Records a flashcard review with rating and schedules next review
  def create
    # Find or initialize a user progress for this flashcard
    flashcard = Flashcard.find(params[:flashcard_id])
    user_progress = UserProgress.find_or_initialize_by(
      user: current_user,
      flashcard: flashcard
    )
    
    # Get the rating from the request
    rating = params[:rating].to_i
    
    # Use the SpacedRepetitionService to calculate the next review
    updated_progress = SpacedRepetitionService.calculate_next_review(user_progress, rating)
    
    # Save the updated progress
    if updated_progress.save
      render json: {
        success: true,
        next_review: updated_progress.next_review,
        times_reviewed: updated_progress.times_reviewed,
        message: "Review recorded successfully. Next review scheduled for #{updated_progress.next_review.strftime('%B %d, %Y')}"
      }
    else
      render json: { 
        success: false, 
        errors: updated_progress.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/flashcard_reviews/stats
  # Returns statistics about the user's flashcard reviews
  def stats
    # Get all user progresses for this user
    progresses = current_user.user_progresses
    
    # Calculate statistics
    total_cards = Flashcard.count
    cards_started = progresses.count
    cards_due = progresses.where('next_review <= ?', Time.current).count
    
    # Calculate review streak (consecutive days with at least one review)
    streak = calculate_streak(progresses)
    
    # Calculate category breakdown
    category_stats = {}
    Category.all.each do |category|
      category_flashcard_ids = category.flashcards.pluck(:id)
      category_progresses = progresses.where(flashcard_id: category_flashcard_ids)
      
      category_stats[category.name] = {
        total: category.flashcards.count,
        started: category_progresses.count,
        mastered: category_progresses.where('ease_factor > ?', 2.5).count
      }
    end
    
    # Return the statistics
    render json: {
      total_cards: total_cards,
      cards_started: cards_started,
      cards_due: cards_due,
      completion_percentage: total_cards > 0 ? (cards_started.to_f / total_cards * 100).round : 0,
      streak: streak,
      categories: category_stats
    }
  end
  
  private
  
  def calculate_streak(progresses)
    # Get all dates when reviews were done, in reverse chronological order
    review_dates = progresses.where.not(last_reviewed: nil)
                             .pluck(:last_reviewed)
                             .map { |date| date.to_date }
                             .uniq
                             .sort
                             .reverse
    
    return 0 if review_dates.empty?
    
    # Check if today has reviews
    today = Date.current
    if !review_dates.include?(today)
      # Check if yesterday had reviews to maintain streak
      yesterday = today - 1.day
      return 0 unless review_dates.include?(yesterday)
    end
    
    # Count consecutive days with reviews
    streak = 1
    last_date = review_dates[0]
    
    review_dates[1..-1].each do |date|
      if last_date - date == 1
        streak += 1
        last_date = date
      else
        break
      end
    end
    
    streak
  end
end