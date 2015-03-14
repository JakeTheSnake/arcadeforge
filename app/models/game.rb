class Game < ActiveRecord::Base
    belongs_to :user
    has_attached_file :thumbnail, :default_url => "cog.png"
    
    validates :user, presence: true
    validates_attachment_content_type :thumbnail, :content_type => /\Aimage\/.*\Z/

    before_validation :sanitize_votes
    before_save :delete_image?

    attr_accessor :delete_image

    def sanitize_votes
        if self.votes.nil?
            self.votes = 0
        end
    end

    private

    def delete_image?
        if @delete_image == "1" then
            self.thumbnail.clear
        end
    end
    
end
