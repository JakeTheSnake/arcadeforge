cd /vagrant

# Set up Arcade Forge Rails app & database
echo 'Installing Ruby...'
rvm install --quiet-curl 2.3
echo '... Ruby installed.'
rvm use --default 2.3
rvm gemset use global && gem install bundler
bundle install
rake db:create
rake db:migrate

echo 'Done! Remember to set environment variables manually.'