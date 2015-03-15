class ImagesController < ApplicationController
  def upload_image
    @image = Image.new(image_params)
    @image.user_id = current_user.id
    @image.save
    render :json => @image
  end

  def upload_image_form
    @image = Image.new
    render layout: false
  end

  def destroy_image
    @image = Image.find_by_id(params[:id])
    @image.destroy! if not image.nil? && @image.user_id == current_user.id
  end

  def all_images
    @images = Image.where(:user_id => 3)
  end

  private

  def image_params
    params.require(:image).permit(:url)
  end
end
