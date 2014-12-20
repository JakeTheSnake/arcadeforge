class AddIndexToKeys < ActiveRecord::Migration
  def change
    add_index :beta_keys, :key, :unique => true
  end
end
