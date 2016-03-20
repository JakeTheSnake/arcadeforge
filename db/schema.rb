# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160320115436) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "audios", id: :uuid, default: nil, force: :cascade do |t|
    t.string   "tags",             default: [], array: true
    t.string   "name"
    t.string   "url_file_name"
    t.string   "url_content_type"
    t.integer  "url_file_size"
    t.datetime "url_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  add_index "audios", ["user_id"], name: "index_audios_on_user_id", using: :btree

  create_table "games", force: :cascade do |t|
    t.string   "name",                   limit: 255
    t.json     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id",                                        null: false
    t.integer  "votes"
    t.integer  "published"
    t.integer  "played_count",                       default: 0
    t.string   "thumbnail_file_name",    limit: 255
    t.string   "thumbnail_content_type", limit: 255
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
    t.boolean  "featured"
  end

  add_index "games", ["user_id"], name: "index_games_on_user_id", using: :btree

  create_table "images", force: :cascade do |t|
    t.string   "tags",             limit: 255, default: [], array: true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "url_file_name",    limit: 255
    t.string   "url_content_type", limit: 255
    t.integer  "url_file_size"
    t.datetime "url_updated_at"
    t.integer  "user_id"
  end

  add_index "images", ["user_id"], name: "index_images_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "username",               limit: 255,              null: false
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "provider",               limit: 255
    t.string   "uid",                    limit: 255
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["provider"], name: "index_users_on_provider", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["uid"], name: "index_users_on_uid", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  add_foreign_key "audios", "users"
end
