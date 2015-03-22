class ChangePublishedToInteger < ActiveRecord::Migration
  def up
    change_column :games, :published, 'integer USING CAST(published AS integer)'
    Game.connection.execute('UPDATE games SET published=2 WHERE published=1')
  end

  def down
    change_column :games, :published, 'boolean USING CAST(published AS boolean)'
  end
end
