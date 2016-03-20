class Audio < ActiveRecord::Base
  belongs_to :user
  has_attached_file :url

  # Validate the attached image is audio/*
  validates_attachment_content_type :url, :content_type => /\Aaudio\/.*\Z/

  before_destroy :clear_audio

  private

  def clear_audio
    self.url.clear
  end

end