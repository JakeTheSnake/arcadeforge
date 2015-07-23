require 'rails_helper'

RSpec.describe Image, :type => :model do
  it "has a valid factory" do
        expect(FactoryGirl.create(:image)).to be_valid
    end
end
