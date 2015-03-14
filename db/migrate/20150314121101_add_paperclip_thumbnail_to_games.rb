class AddPaperclipThumbnailToGames < ActiveRecord::Migration
  def change
    add_attachment :games, :thumbnail
  end
end
