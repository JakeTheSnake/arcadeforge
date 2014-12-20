class HomeController < ApplicationController
  def index
  	@popular_games = Game.where(:published => true).order(votes: :desc).limit(10)
  	@recent_games = Game.where(:published => true).order(created_at: :desc).limit(10)
  end

  def about
  end
end
