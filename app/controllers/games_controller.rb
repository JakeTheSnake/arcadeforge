class GamesController < ApplicationController
  layout "editor", :except => [:new, :index, :edit, :show]
  before_action :authenticate_user!, :except => [:show, :index]
  before_action :verify_game_owner, :except => [:show, :index, :create, :new]
  
  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    @game.user = current_user
    @game.published = 0
    @game.save!
    redirect_to action: 'editor', :id => @game.id
  end

  def update
    if params[:game][:thumbnail].nil?
      @game.update!(game_params_do_not_update_image)
    else
      @game.update!(game_params)
    end
    redirect_to controller: 'profile', action: 'mygames'
  end

  def edit
    
  end
  
  def editor
    gon.game = @game.data
    gon.published = @game.published
    gon.gameId = @game.id
    gon.isFirstGame = current_user.games.count == 1
    gon.auth_key = form_authenticity_token if protect_against_forgery?
  end

  def savegame
    if @game.update!(game_params)
      render :text => "ok"
    else
      render :text => "nok"
    end
  end

  def destroy
    @game.destroy!
    redirect_to controller: 'profile', action: 'mygames'
  end

  def index
    @popular_games = Game.includes(:user).published.order(played_count: :desc).limit(5).select_without_data
    @all_games = Game.includes(:user).published.order(created_at: :desc).select_without_data
  end

  def show
    @game = Game.find_by_id(params[:id])
    render_error_message(:heading => "Sorry!", :message => "Game is not available yet.", :status => 403) unless @game.published > 0
    if should_increase_played_count? then
      session[:shown_games].push(@game.id)
      @game.played_count += 1
      @game.save!
    end
    gon.game = @game.data
    gon.gameName = @game.name
    gon.gameId = @game.id
    render layout: "play" if @game.published > 0
  end

  def publish
    if @game.update!(game_params_publish)
      render :plain => "OK"
    else
      render :plain => "NOK"
    end
  end

  private

  def verify_game_owner
    @game = Game.find_by_id(params[:id])
    if @game.user_id != current_user.id
      render_error_message(:heading => "Nope!", :message => "This is not your game. Make your own game!", :status => 403)
    end
  end

  def game_params
    params.require(:game).permit(:name, :data, :delete_image, :thumbnail)
  end

  def game_params_do_not_update_image
    params.require(:game).permit(:name, :data, :delete_image)
  end

  def game_params_publish
    params.require(:game).permit(:published)
  end

  def should_increase_played_count?
    session[:shown_games] = [] unless session[:shown_games]
    !session[:shown_games].include?(@game.id)
  end
  
end
