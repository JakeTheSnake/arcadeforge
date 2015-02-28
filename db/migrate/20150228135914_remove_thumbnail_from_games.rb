class RemoveThumbnailFromGames < ActiveRecord::Migration
  def change
    remove_column :games, :thumbnail
  end
end
