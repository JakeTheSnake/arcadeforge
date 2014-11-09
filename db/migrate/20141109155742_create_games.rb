class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.json :data

      t.timestamps
    end
  end
end
