# FonaBot Frontend (FonaBot.com)

Interactive Voice Response (IVR) flow builder and management interface for FonaBot.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Docker (optional, for containerized deployment)

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.development` and configure:
   ```bash
   cp .env.example .env.development
   ```

## Environment Variables

Required environment variables (see `.env.example`):
- `VITE_API_BASE_URL`: FonaBot API endpoint
- `VITE_WS_BASE_URL`: WebSocket endpoint for live updates
- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics
- `VITE_ENABLE_ERROR_REPORTING`: Enable/disable error reporting

## Development

Start the development server:
```bash
npm run dev
```

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Docker

Build the Docker image:
```bash
docker build -t fonabot-frontend .
```

Run the container:
```bash
docker run -p 80:80 fonabot-frontend
```

## Features

- Visual IVR Flow Builder
- Real-time Call Monitoring
- Call Logs and Analytics
- User Authentication
- Provider Integration Management