# FonaBot Backend

Backend service for FonaBot IVR platform, handling call flows, telephony integration, and user management.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- PostgreSQL 15.x or later
- Redis 7.x or later
- Docker (optional, for containerized deployment)

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.development`:
   ```bash
   cp .env.example .env.development
   ```

## Environment Configuration

See `.env.example` for required environment variables, including:
- Database configuration
- Redis settings
- JWT configuration
- Security settings
- Rate limiting
- Logging options
- Optional provider credentials

## Development

Start the development server:
```bash
npm run start:dev
```

Run tests:
```bash
npm test
npm run test:e2e
```

## Production Build

Build the application:
```bash
npm run build
```

Start production server:
```bash
npm run start:prod
```

## Docker

Build the Docker image:
```bash
docker build -t fonabot-backend .
```

Run the container:
```bash
docker run -p 3000:3000 --env-file .env.production fonabot-backend
```

## API Endpoints

### Authentication
- POST `/api/auth/register`: Register new user
- POST `/api/auth/login`: User login

### IVR Flows
- GET `/api/ivr-flows`: List flows
- POST `/api/ivr-flows`: Create flow
- GET `/api/ivr-flows/:id`: Get flow
- PUT `/api/ivr-flows/:id`: Update flow
- DELETE `/api/ivr-flows/:id`: Delete flow

### Call Logs
- GET `/api/call-logs`: List call logs
- GET `/api/call-logs/:id/events`: Get call events

### Telephony
- POST `/api/telephony/test-call`: Make test call
- POST `/api/telephony/fonabot/incoming/voice`: Handle incoming calls
- POST `/api/telephony/fonabot/ivr-step`: Process IVR steps

## Architecture

- NestJS framework
- TypeORM for database access
- Redis for session management
- WebSocket for real-time updates
- JWT authentication
- Rate limiting and security middleware