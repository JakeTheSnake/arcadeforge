class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :tags, array: true, default: []

      t.timestamps
    end
  end
end
