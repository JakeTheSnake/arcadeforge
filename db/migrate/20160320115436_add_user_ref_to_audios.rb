class AddUserRefToAudios < ActiveRecord::Migration
  def change
    add_reference :audios, :user, index: true, foreign_key: true
  end
end
