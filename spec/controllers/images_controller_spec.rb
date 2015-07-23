require 'rails_helper'

RSpec.describe ImagesController, type: :controller do
  let(:user) { FactoryGirl.create(:user) }
  render_views

  describe "GET #all_images" do
    before :each do
      sign_in user
      request.env["HTTP_ACCEPT"] = 'application/json'
    end

    it "returns http success" do
      get :all_images
      expect(response).to have_http_status(:success)
    end

    it "returns expected images" do
        image = FactoryGirl.create(:image, :user_id => user.id)
        expected = {
            :images => [{
                :id => image.id,
                :url => image.url.url
            }]
        }.to_json

        get :all_images
        expect(response.body).to eq(expected)
    end
  end
end
