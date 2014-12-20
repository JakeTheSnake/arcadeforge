class CreateBetaKeys < ActiveRecord::Migration
  def change
    create_table :beta_keys do |t|
      t.uuid :key
      t.timestamps
    end
  end
end
