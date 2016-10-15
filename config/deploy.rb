require 'mina/bundler'  
require 'mina/rails'  
require 'mina/git'  
require 'mina/rvm'

set :rails_env, 'production'  
set :domain, '52.57.88.38'  
set :deploy_to, '/home/ubuntu/webapp/'
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
  invoke :'rvm:use[ruby-2.2.3@default]'
end

task :setup => :environment do  

end

desc "Deploys the current version to the server."  
task :deploy => :environment do  
  deploy do
    invoke :'git:clone'

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

desc "Invokes a raketask"
task :invoke => :environment do
  queue! "cd git/arcadeforge"
  queue! "bundle exec rake #{ENV['task']} RAILS_ENV=production"
end

RYAML = <<-BASH
function ryaml {
  ruby -ryaml -e 'puts ARGV[1..-1].inject(YAML.load(File.read(ARGV[0]))) {|acc, key| acc[key] }' "$@"
};
BASH
namespace :sync do
  task :db => :environment do
    isolate do
      queue RYAML
      queue "USERNAME=$(ryaml /home/ubuntu/git/arcadeforge/shared/config/database.yml #{rails_env} username)"
      queue "DATABASE=$(ryaml /home/ubuntu/git/arcadeforge/shared/config/database.yml #{rails_env} database)"
      queue "PGPASSWORD=$ARCADEFORGE_DB_PASS pg_dump -U $USERNAME -h localhost $DATABASE -c --no-owner -f dump.sql"
      queue "gzip -f dump.sql"

      mina_cleanup!
    end

    %x[scp -i #{identity_file} #{user}@#{domain}:dump.sql.gz .]
    %x[gunzip -f dump.sql.gz]
    %x[PGPASSWORD=archonforge -h localhost dropdb -U arcadeforge arcadeforge_development]
    %x[PGPASSWORD=archonforge -h localhost createdb -U arcadeforge arcadeforge_development]
    %x[PGPASSWORD=archonforge psql -d arcadeforge_development -U arcadeforge -h localhost -f dump.sql]
    %x[rm dump.sql]
  end
end