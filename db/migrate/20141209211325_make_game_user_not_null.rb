class MakeGameUserNotNull < ActiveRecord::Migration
  def change
    change_column_null :games, :user_id, false
  end
end
