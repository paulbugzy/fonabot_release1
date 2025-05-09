#!/bin/bash
# Script to set up SSL for fonabot.com

# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d fonabot.com -d www.fonabot.com

# Set up auto-renewal
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

# Restart Nginx
sudo systemctl restart nginx

echo "SSL setup complete for fonabot.com"