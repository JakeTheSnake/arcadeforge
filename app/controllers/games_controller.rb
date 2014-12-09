class GamesController < ApplicationController
  layout "game"
  before_action :authenticate_user!, :except => [:show, :index]
  before_action :verify_game_owner, :except => [:show, :index, :create, :new]
  
  def new
    render :edit
  end

  def create
  end

  def update
  end

  
  def edit
    @game = Game.find_by_id(params[:id])
  end

  def destroy
  end

  def index
  end

  def show
  end

  private

  def verify_game_owner
    if @game.user != current_user
      render(:file => File.join(Rails.root, 'public/403.html'), :status => 403, :layout => false)
    end
  end
end
