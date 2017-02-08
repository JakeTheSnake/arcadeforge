apt-get update
apt-get install -y postgresql-9.5 libpq-dev nodejs
if sudo -u postgres psql -c "CREATE USER arcadeforge WITH CREATEDB LOGIN PASSWORD 'archonforge';" ; then
  sudo sed -i "s/#listen_address.*/listen_addresses '*'/" /etc/postgresql/9.5/main/postgresql.conf
  sudo cat >> /etc/postgresql/9.5/main/pg_hba.conf <<EOF
# Accept all IPv4 connections - FOR DEVELOPMENT ONLY!!!
host    all         all         0.0.0.0/0             md5
EOF
fi