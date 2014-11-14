class Game < ActiveRecord::Base
	belongs_to :user

	before_validation :sanitize_votes

	def sanitize_votes
		if self.votes.nil?
			self.votes = 0
		end
	end
	
end
