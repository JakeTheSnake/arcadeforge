class GameController < ApplicationController
	def index
		@games = Game.all
	end
	def new
		@game = Game.new
	end

	def show

	end

	def create
	  @game = Game.new(params[:game])
	  @game.save
	  redirect_to @game
	end

	private

	def game_params
	params.require(:game).permit(:title, :author, :description, :feedback, :limitations, :saved_game)
	end

end
