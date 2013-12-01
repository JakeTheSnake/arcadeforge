class ChangeStuffToTextArea < ActiveRecord::Migration
  def change
    change_table :games do |t|
      t.remove :description, :limitations, :feedback, :saved_game
      t.text :description, :limitations, :feedback, :saved_game
    end
  end
end
