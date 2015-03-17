class ImagesController < ApplicationController
  def upload_image
    @image = Image.new(image_params)
    @image.user_id = current_user.id
    @image.save
    render :plain => @image.url
  end

  def destroy_image
    @image = Image.find_by_id(params[:image][:id])
    if @image.user_id == current_user.id
      @image.destroy! if not @image.nil?
      render :plain => 'OK'
    else
      render :plain => 'NOK'
    end
  end

  def all_images
    @images = Image.where(:user_id => 3)
  end

  private

  def image_params
    params.require(:image).permit(:url)
  end
end
