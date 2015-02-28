class AddImageRefToGames < ActiveRecord::Migration
  def change
    add_reference :games, :image, index: true
  end
end
