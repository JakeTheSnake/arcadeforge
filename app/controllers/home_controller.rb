class HomeController < ApplicationController
  def index
  	@popular_games = Game.order(votes: :desc).limit(10)
  	@newest_games = Game.order(created_at: :desc).limit(10)
  end

  def about
  end
end
