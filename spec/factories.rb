require 'faker'

FactoryGirl.define do
  factory :user do
    sequence(:username) { |n| "monkey#{n}" }
    password "bananaman123"
    email {"#{username}@test.com"}
    confirmed_at DateTime.now
  end

  factory :game do
    name "#{Faker::Lorem.word} #{Faker::Number.digit}"
    votes Faker::Number.number(4)
    played_count Faker::Number.number(5)
    published 0
    featured false
    user
  end

  factory :image do
    user
  end

end