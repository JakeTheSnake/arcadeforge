class AddUrlToImage < ActiveRecord::Migration
  def up
  	add_attachment :images, :url
  end

  def down
  	remove_attachment :images, :url
  end
end
