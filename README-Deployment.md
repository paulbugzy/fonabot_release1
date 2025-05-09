# FonaBot Deployment Instructions for AWS Lightsail

## Domain and SSL Setup

1. Point your domain to your Lightsail instance:
   - Add an A record for `fonabot.com` pointing to `3.140.108.161`
   - Add an A record for `www.fonabot.com` pointing to `3.140.108.161`

2. Install Certbot for SSL:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

3. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d fonabot.com -d www.fonabot.com
   ```

## Server Setup

### Backend Deployment

1. Navigate to the backend directory:
   ```bash
   cd /home/ubuntu/fonabot_release1/ivr-platform-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Set up the systemd service:
   ```bash
   sudo cp systemd-services/fonabot-backend.service /etc/systemd/system/
   sudo systemctl enable fonabot-backend
   sudo systemctl start fonabot-backend
   ```

5. Check the service status:
   ```bash
   sudo systemctl status fonabot-backend
   ```

### Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd /home/ubuntu/fonabot_release1/fonabot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Set up Nginx:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/fonabot
   sudo ln -s /etc/nginx/sites-available/fonabot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Redis Configuration

1. Configure Redis to listen on all interfaces:
   ```bash
   sudo nano /etc/redis/redis.conf
   ```

2. Change the bind address from `127.0.0.1` to your private IP `172.26.13.124`

3. Set a password for Redis (recommended):
   ```
   requirepass your_secure_password
   ```

4. Update the `.env` file with the Redis password

5. Restart Redis:
   ```bash
   sudo systemctl restart redis-server
   ```

## Firewall Configuration

1. Allow necessary ports:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow from 172.26.15.172 to any port 6379
   ```

2. Enable the firewall:
   ```bash
   sudo ufw enable
   ```

## Monitoring and Logs

- View backend logs:
  ```bash
  sudo journalctl -u fonabot-backend -f
  ```

- View Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```

## Troubleshooting

1. If the backend can't connect to Redis:
   - Check Redis is running: `sudo systemctl status redis-server`
   - Verify Redis is listening on the correct interface: `sudo netstat -tulpn | grep redis`
   - Test connection: `redis-cli -h 172.26.13.124 ping`

2. If the frontend can't connect to the backend:
   - Check the backend is running: `sudo systemctl status fonabot-backend`
   - Verify the API URL in the frontend environment files
   - Check Nginx configuration: `sudo nginx -t`

3. SSL certificate issues:
   - Renew certificate: `sudo certbot renew`
   - Test certificate renewal: `sudo certbot renew --dry-run`

4. Database connection issues:
   - Verify database credentials in the `.env` file
   - Test connection: `psql -h ls-3b1ab034a3db0474a2044c0886fb983a257f6994.c0vi6is2u0t2.us-east-1.rds.amazonaws.com -U dbmasteruser -d FonaBot_Release1`