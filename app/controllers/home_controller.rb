class HomeController < ApplicationController
  def index
    @featured_games = Game.includes(:user).not_private.featured.limit(5).select_without_data
  end

  def about
  end
end
