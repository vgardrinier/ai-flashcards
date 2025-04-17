Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :create, :update]
      
      resources :categories, only: [:index, :show, :create]
      
      resources :flashcards, only: [:index, :show, :create, :update]
      
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
