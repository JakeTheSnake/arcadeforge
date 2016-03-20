class AudiosController < ApplicationController

  before_action :authenticate_user!

  def upload_audio
    @audio = Audio.new(audio_params)
    @audio.id = SecureRandom.uuid
    @audio.name = @audio.url.original_filename
    @audio.user_id = current_user.id
    @audio.save
  end

  def destroy_audio
    @audio = Audio.find_by_id(params[:audio][:id])
    if not @audio.nil? && @audio.user_id == current_user.id
      @audio.destroy!
      render :plain => 'OK'
    else
      render :plain => 'NOK'
    end
  end

  def all_audios
    @audios = Audio.where(:user_id => current_user.id)
  end

  private

  def audio_params
    params.require(:audio).permit(:url)
  end
end