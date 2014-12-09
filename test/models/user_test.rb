require 'spec_helper'


describe User do
  it "authenticates with matching username and password" do
    create :user, :username => "batman", :password => "batcave"
  end
end
