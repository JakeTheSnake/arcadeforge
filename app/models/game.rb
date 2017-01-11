class Game < ActiveRecord::Base
    belongs_to :user
    has_attached_file :thumbnail, :default_url => 'cog.png'
    
    validates :user, presence: true
    validates_attachment_content_type :thumbnail, :content_type => /\Aimage\/.*\Z/

    before_validation :sanitize_votes
    before_save :delete_image?

    attr_accessor :delete_image

    scope :not_private, -> { where.not(published: 0) }
    scope :unlisted, -> { where(published: 1)}
    scope :published, -> { where(published: 2) }
    scope :featured, -> { where(featured: true) }
    scope :select_without_data, -> { select(column_names - ['data']) }

    def sanitize_votes
        if self.votes.nil?
            self.votes = 0
        end
    end

    def data
        (self[:data].class == String) ? JSON.parse(self[:data]) : self[:data]
    end

    def data=(value)
        jsonvalue = (value.class == String) ? JSON.parse(value) : value
        write_attribute(:data, jsonvalue)
    end

    private

    def delete_image?
        if @delete_image == "1" then
            self.thumbnail.clear
        end
    end
    
end
