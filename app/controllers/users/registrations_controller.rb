class Users::RegistrationsController < Devise::RegistrationsController
# before_filter :configure_sign_up_params, only: [:create]
# before_filter :configure_account_update_params, only: [:update]
after_filter :remove_used_beta_key, only: [:create]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  #POST /resource
  def create
    @user = User.new(sign_up_params)
    if !params[:betakey].empty? and params[:betakey].match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
      @betakey = BetaKey.find_by_key(params[:betakey])
      if not @betakey.nil?
        super
      else
        flash[:notice] = "Beta key not found."
        render :new
      end
    else
      flash[:notice] = "Beta key is in the wrong format."
      render :new
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # You can put the params you want to permit in the empty array.
  # def configure_sign_up_params
  #  devise_parameter_sanitizer.for(:sign_up) << :betakey
  # end

  # You can put the params you want to permit in the empty array.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.for(:account_update) << :attribute
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private

  def remove_used_beta_key
    @betakey.destroy! if user_signed_in?
  end
end
