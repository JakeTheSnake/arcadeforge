class AddThumbnailToGames < ActiveRecord::Migration
  def change
    add_column :games, :thumbnail, :string
  end
end
