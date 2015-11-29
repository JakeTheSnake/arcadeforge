class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable, :omniauth_providers => [:facebook]
  has_many :games

  validates :username, :email, presence: true, uniqueness: true
  
  def self.from_omniauth(auth)
    if User.exists?(email: auth.info.email)
      user = User.find_by_email auth.info.email
      user.provider = auth.provider
      user.uid = auth.uid
      user.skip_confirmation!
      return user
    else
      where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
        user.email = auth.info.email
        user.password = Devise.friendly_token[0,20]
        user.username = self.generate_unique_username
        user.skip_confirmation!
      end
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  private

  def self.generate_unique_username
    loop do
      username = "user#{rand(10000000..99999999)}"
      break username unless User.exists?(username: username)
    end
  end
end
