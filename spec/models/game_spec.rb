require 'spec_helper'

RSpec.describe Game, type: :model do
  it 'has a valid factory' do
    expect(FactoryGirl.create(:game)).to be_valid
  end
end
