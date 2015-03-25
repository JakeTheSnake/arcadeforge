namespace :admin do
    task :unlist, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:published => 1)
    end

    task :publish, [:id] => [:environment] do |t, args|
        Game.find_by_id(args.id).update(:published => 2)
    end
end