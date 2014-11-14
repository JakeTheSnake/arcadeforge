class AddVotesToGames < ActiveRecord::Migration
  def change
    add_column :games, :votes, :integer
  end
end
