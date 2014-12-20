namespace :betakey do
  desc "Generate 10 beta keys"
  task generate: :environment do
    result = []
    10.times do
      new_key = SecureRandom.uuid
      result.append(new_key)
      BetaKey.create!(:key => new_key)
    end
    puts result
  end

end
