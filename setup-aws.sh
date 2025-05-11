#!/bin/bash
# Script to set up FonaBot on AWS Lightsail

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Copy configuration files
sudo cp nginx.conf /etc/nginx/sites-available/fonabot
sudo ln -s /etc/nginx/sites-available/fonabot /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Set up systemd services
sudo cp systemd-services/fonabot-backend.service /etc/systemd/system/
sudo systemctl enable fonabot-backend

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 172.26.15.172 to any port 6379
sudo ufw --force enable

# Deploy backend
cd /home/ubuntu/fonabot_release1/fonabot-backend
npm install
npm run build
sudo systemctl start fonabot-backend

# Deploy frontend
cd /home/ubuntu/fonabot_release1/fonabot-frontend
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx

echo "FonaBot setup complete!"