
class GamePresenter < BasePresenter
	presents :user

	delegate :name, :to => :user
	delegate :votes, :to => :user


	def age
		time_since = Time.now - user.created_at
		return "%d sec" % time_since if time_since < 60
		return "%d min" % (time_since / 60) if time_since < 60 * 60
		return "%d hours" % (time_since / 3600) if time_since < 60 * 60 * 24
		return "%d days" % (time_since / 86400)
	end
end