class GamePresenter < BasePresenter
	presents :game

	delegate :name, :to => :game
	delegate :votes, :to => :game


	def age
		time_since = Time.now - game.created_at
		return "%d sec" % time_since if time_since < 60
		return "%d min" % (time_since / 60) if time_since < 60 * 60
		return "%d hours" % (time_since / 3600) if time_since < 60 * 60 * 24
		return "%d days" % (time_since / 86400)
	end

	def thumbnail
		if game.thumbnail.nil? or game.thumbnail.empty?
			h.image_tag "cog.png", :width => 152, :height => 152
		else
			h.image_tag game.thumbnail, :width => 152, :height => 152
		end
	end
end