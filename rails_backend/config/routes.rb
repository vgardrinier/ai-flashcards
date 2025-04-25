Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :create, :update]
      
      resources :categories, only: [:index, :show, :create]
      
      resources :flashcards, only: [:index, :show, :create, :update, :destroy]
      
      # Flashcard reviews with spaced repetition
      resources :flashcard_reviews, only: [:create] do
        collection do
          get 'due', to: 'flashcard_reviews#due'
          get 'new', to: 'flashcard_reviews#new'
          get 'stats', to: 'flashcard_reviews#stats'
        end
      end
      
      resources :quiz_questions, only: [:index, :show, :create] do
        collection do
          post 'generate'
        end
        member do
          post 'attempt'
        end
      end
      
      resources :progress, only: [:create, :update] do
        collection do
          get ':user_id', to: 'progress#index'
          get 'due/:user_id', to: 'progress#due'
          get 'stats/:user_id', to: 'progress#stats'
        end
      end
      
      resources :elo_scores, only: [] do
        collection do
          get ':user_id', to: 'elo_scores#show'
          put ':user_id', to: 'elo_scores#update'
          get ':user_id/history', to: 'elo_scores#history'
          get 'levels', to: 'elo_scores#levels'
        end
      end
      
      # User profile and settings
      get 'profile', to: 'profiles#show'
      put 'profile', to: 'profiles#update'
      put 'profile/change_password', to: 'profiles#change_password'
      
      # User settings
      get 'user_settings', to: 'user_settings#show'
      put 'user_settings', to: 'user_settings#update'
      
      # Email verification
      get 'verify_email/:token', to: 'auth#verify_email'
      post 'resend_verification', to: 'auth#resend_verification'
      
      # Password reset
      post 'forgot_password', to: 'auth#forgot_password'
      put 'reset_password/:token', to: 'auth#reset_password'
      
      # Testing routes
      namespace :tests do
        post 'openai/generate_question', to: 'openai#generate_question'
        get 'openai/test_connection', to: 'openai#test_connection'
      end
      
      # Authentication routes
      post 'login', to: 'auth#login'
      post 'logout', to: 'auth#logout'
      get 'me', to: 'auth#me'
    end
  end
end
