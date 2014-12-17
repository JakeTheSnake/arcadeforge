class ProfileController < ApplicationController
  
  before_action :authenticate_user!
  def mygames
    @games = Game.where(:user => current_user)
    
  end
end
