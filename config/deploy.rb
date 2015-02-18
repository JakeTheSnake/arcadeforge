require 'mina/bundler'  
require 'mina/rails'  
require 'mina/git'  
require 'mina/rvm'

set :rails_env, 'production'  
set :domain, '54.93.41.116'  
set :deploy_to, '/home/ubuntu/git/arcadeforge'
set :repository, 'git@github.com:JakeTheSnake/arcadeforge.git'  
set :branch, 'master'  
set :user, 'ubuntu'
set :forward_agent, true  
set :port, '22'
set :identity_file, "/home/#{ENV['USER']}/.ssh/Jake.pem"

set :shared_paths, ['config/database.yml', 'log', 'config/secrets.yml']

task :environment do  
  queue %{
echo "-----> Loading environment"  
#{echo_cmd %[source ~/.bash_profile]}
}
  invoke :'rvm:use[ruby-2.1.5@default]'
end

task :setup => :environment do  
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! %[touch "#{deploy_to}/shared/config/database.yml"]
  queue %[echo "-----> Be sure to edit 'shared/config/database.yml'."]

  queue! %[touch "#{deploy_to}/shared/config/secrets.yml"]
  queue %[echo "-----> Be sure to edit 'shared/config/secrets.yml'."]
end

desc "Deploys the current version to the server."  
task :deploy => :environment do  
  deploy do
    invoke :'git:clone'
    queue "git submodule init"
    queue "git submodule update"

    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'

    to :launch do
      invoke :'passenger:restart'
    end
  end
end

desc "Restarts the nginx server."  
task :restart do  
  invoke :'passenger:restart'
end

namespace :passenger do  
  task :restart do
    queue "mkdir #{deploy_to}/current/tmp; touch #{deploy_to}/current/tmp/restart.txt"
  end
end 