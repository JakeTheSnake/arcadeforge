class HomeController < ApplicationController
  def index
  	@popular_games = Game.where(:published => true).order(played_count: :desc).limit(7)
  	@recent_games = Game.where(:published => true).order(created_at: :desc).limit(7)
  end

  def about
  end
end
