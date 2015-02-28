class Game < ActiveRecord::Base
    belongs_to :user
    validates :user, presence: true
    belongs_to :image
    accepts_nested_attributes_for :image, allow_destroy: true

    before_validation :sanitize_votes

    attr_accessor :delete_image

    before_save :delete_image?

    def sanitize_votes
        if self.votes.nil?
            self.votes = 0
        end
    end

    private

    def delete_image?
        if @delete_image == "1" then
            self.image.clear_image
        end
    end
    
end
