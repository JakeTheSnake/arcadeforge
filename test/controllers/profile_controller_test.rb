require 'test_helper'

class ProfileControllerTest < ActionController::TestCase
  test "should get mypage" do
    get :mypage
    assert_response :success
  end

end
