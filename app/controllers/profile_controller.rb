class ProfileController < ApplicationController
  
  before_action :authenticate_user!
  def mypage
    @games = Game.where(:user => current_user)
    
  end
end
