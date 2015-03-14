class Image < ActiveRecord::Base
  belongs_to :user
  has_attached_file :url

  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :url, :content_type => /\Aimage\/.*\Z/

  before_destroy :clear_image

  private

  def clear_image
    self.url.clear
  end

end