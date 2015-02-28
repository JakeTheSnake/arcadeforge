class Image < ActiveRecord::Base
  has_one :user
  has_attached_file :url

  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :url, :content_type => /\Aimage\/.*\Z/

  def clear_image
    self.url.clear
    self.destroy
  end

end