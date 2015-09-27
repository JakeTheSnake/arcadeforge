namespace :admin do
    task :unlist, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:published => 1)
    end

    task :publish, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:published => 2)
    end

    task :feature, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:featured => true)
    end

    task :unfeature, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:featured => false)
    end

    task :list => [:environment] do
        Game.select(:id, :name).order(name: :asc).each {|g| puts "#{g.id}: #{g.name}"}
    end

    task :steal, [:game_id, :user_id] => [:environment] do |t, args|
        Game.find_by_id(args.game_id).update(:user_id => args.user_id)
    end
end
