class AddPublishedToGame < ActiveRecord::Migration
  def change
    add_column :games, :published, :boolean
  end
end
