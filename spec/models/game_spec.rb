require 'spec_helper'

RSpec.describe Game, type: :model do
  it 'has a valid factory' do
    expect(FactoryGirl.create(:game)).to be_valid
  end

  it 'has three game categories' do
    FactoryGirl.create(:game, :published => 0)
    FactoryGirl.create(:game, :published => 1)
    FactoryGirl.create(:game, :published => 2)

    expect(Game.not_private.count).to eq(2)
    expect(Game.unlisted.count).to eq(1)
    expect(Game.published.count).to eq(1)
  end
end
