class GamesController < ApplicationController
	def index
		@games = Game.all
	end
	def new
		@game = Game.new
	end

	def edit
		@game = Game.find(params[:id])
	end

	def update
		@game = Game.find(params[:id])
		if @game.update(game_params)
			redirect_to @game
		else
			render 'edit'
		end
	end

	def show
		@game = Game.find(params[:id])
	end

	def create
	  @game = Game.new(game_params)
	  @game.save
	  redirect_to games_path
	end

	private

	def game_params
	  params.fetch(:game, {}).permit(:title, :author, :description, :feedback, :limitations, :saved_game)
	end

end
