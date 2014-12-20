class AddPlayedToGames < ActiveRecord::Migration
  def change
    add_column :games, :played_count, :integer, :default => 0
  end
end
