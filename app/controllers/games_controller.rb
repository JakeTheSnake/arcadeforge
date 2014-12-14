class GamesController < ApplicationController
  layout "game", :except => [:new, :index, :edit]
  before_action :authenticate_user!, :except => [:show, :index]
  before_action :verify_game_owner, :except => [:show, :index, :create, :new]
  
  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    @game.user = current_user
    @game.save!
    redirect_to action: 'editor', :id => @game.id
  end

  def update
    @game.update!(game_params)
    redirect_to controller: 'profile', action: 'mypage'
  end

  def edit

  end
  
  def editor
    gon.game = @game.data
  end

  def savegame
    @game.update!(game_params)
    render :text => "ok"
  end

  def destroy
  end

  def index
    @popular_games = Game.order(votes: :desc).limit(5)
    @newest_games = Game.order(created_at: :desc).limit(5)
  end

  def show
    @game = Game.find_by_id(params[:id])
    gon.game = @game.data
  end

  private

  def verify_game_owner
    @game = Game.find_by_id(params[:id])
    if @game.user_id != current_user.id
      render(:file => File.join(Rails.root, 'public/403.html'), :status => 403, :layout => false)
    end
  end

  def game_params
    params.require(:game).permit(:name, :data, :thumbnail)
  end
  
end
