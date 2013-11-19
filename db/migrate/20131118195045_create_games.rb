class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :author
      t.string :title
      t.string :description
      t.string :feedback
      t.string :limitations
      t.string :saved_game

      t.timestamps
    end
  end
end
