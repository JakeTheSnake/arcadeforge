FactoryGirl.define do
  factory :user do
    sequence(:username) { |n| "monkey#{n}" }
    password "bananaman123"
    email "#{username}@test.com"
  end
end