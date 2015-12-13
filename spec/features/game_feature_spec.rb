require 'rails_helper'
require 'capybara/rspec'

describe "editing a game", :type => :feature do
    before :each do
        user = FactoryGirl.create(:user, :password => "asdfasdf")
        visit new_user_session_path
        fill_in "Email", :with => user.email
        fill_in "Password", :with => "asdfasdf"
        click_button "Log in"
    end

    it "should have a edit properties page" do
        game = FactoryGirl.create(:game, :user_id => User.first.id)
        visit edit_game_path game
        expect(page).to have_content "Edit game details"
    end
end
