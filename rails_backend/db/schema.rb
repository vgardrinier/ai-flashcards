# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_04_25_081308) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "elo_levels", force: :cascade do |t|
    t.string "name"
    t.integer "min_score"
    t.integer "max_score"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "elo_scores", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "score"
    t.string "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_elo_scores_on_user_id"
  end

  create_table "flashcards", force: :cascade do |t|
    t.text "question"
    t.text "answer"
    t.text "explanation"
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_flashcards_on_category_id"
  end

  create_table "quiz_attempts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "quiz_question_id", null: false
    t.string "selected_option"
    t.boolean "correct"
    t.integer "score_change"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "elo_score_after"
    t.integer "difficulty"
    t.string "quiz_session_id"
    t.integer "initial_score"
    t.index ["quiz_question_id"], name: "index_quiz_attempts_on_quiz_question_id"
    t.index ["quiz_session_id"], name: "index_quiz_attempts_on_quiz_session_id"
    t.index ["user_id"], name: "index_quiz_attempts_on_user_id"
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.text "question"
    t.string "option_a"
    t.string "option_b"
    t.string "option_c"
    t.string "option_d"
    t.string "correct_option"
    t.integer "difficulty"
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "explanation"
    t.index ["category_id"], name: "index_quiz_questions_on_category_id"
  end

  create_table "user_progresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "flashcard_id", null: false
    t.integer "times_reviewed"
    t.datetime "last_reviewed"
    t.float "ease_factor"
    t.datetime "next_review"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flashcard_id"], name: "index_user_progresses_on_flashcard_id"
    t.index ["user_id", "next_review"], name: "index_user_progresses_on_user_id_and_next_review"
    t.index ["user_id"], name: "index_user_progresses_on_user_id"
  end

  create_table "user_settings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "notification_preference"
    t.string "ui_theme"
    t.string "timezone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_settings_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "user"
    t.string "full_name"
    t.string "avatar_url"
    t.boolean "email_verified", default: false
    t.string "verification_token"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "elo_scores", "users"
  add_foreign_key "flashcards", "categories"
  add_foreign_key "quiz_attempts", "quiz_questions"
  add_foreign_key "quiz_attempts", "users"
  add_foreign_key "quiz_questions", "categories"
  add_foreign_key "user_progresses", "flashcards"
  add_foreign_key "user_progresses", "users"
  add_foreign_key "user_settings", "users"
end
