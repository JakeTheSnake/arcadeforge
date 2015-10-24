class RemoveBetakeys < ActiveRecord::Migration
  def change
    drop_table :beta_keys
  end
end
