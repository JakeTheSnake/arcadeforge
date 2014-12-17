module ApplicationHelper
	def present(object, klass = nil)
		klass ||= "#{object.class}Presenter".constantize
		presenter = klass.new(object, self)
		yield presenter if block_given?
		presenter
	end

	def account_nav
		if user_signed_in?
            [link_to("Profile", edit_user_registration_path), 
            button_to("Log out", destroy_user_session_path, class: "btn btn-warning", method: :delete)]
        else
            [link_to("Login", new_user_session_path),
        	button_to("Sign up", new_user_registration_path, class: "btn", id: "btn-signup", :method => :get)]
        end
    end
end
