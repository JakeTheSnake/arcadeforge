class CreateAudio < ActiveRecord::Migration
  def change
    create_table :audios, {id: false} do |t|
        t.uuid :id, :primary_key => true
        t.string :tags, array: true, default: []
        t.string :name
        t.attachment :url
        t.timestamps
    end
  end
end
