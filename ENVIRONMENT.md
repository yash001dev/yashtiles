# Environment Setup Guide

This project supports multiple environments: **development**, **staging**, and **production**.

## Quick Start

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Update the values in `.env.local` for your local development.

## Available Environments

### Development (Default)
- **Base URL**: `http://localhost:3000`
- **Environment**: `development`
- **Debug**: Enabled
- **Analytics**: Disabled

### Staging
- **Base URL**: `https://yashtiles-staging.vercel.app`
- **Environment**: `staging`
- **Debug**: Enabled
- **Analytics**: Enabled

### Production
- **Base URL**: `https://yashtiles.com`
- **Environment**: `production`
- **Debug**: Disabled
- **Analytics**: Enabled

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Application name | ✅ |
| `NEXT_PUBLIC_ENVIRONMENT` | Current environment | ✅ |
| `NEXT_PUBLIC_API_URL` | API base URL | ⚠️ |
| `NEXT_PUBLIC_APP_VERSION` | Application version | ⚠️ |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Enable debug mode | ⚠️ |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | ⚠️ |

## Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run dev:staging        # Start with staging environment

# Build
npm run build              # Build for production
npm run build:staging      # Build for staging
npm run build:production   # Build for production

# Start
npm run start              # Start production server
npm run start:staging      # Start with staging environment
npm run start:production   # Start with production environment

# Utilities
npm run env:check          # Check environment variables
npm run lint               # Run linter
```

## Environment Files

- `.env.local` - Local development (not committed)
- `.env.development` - Development defaults
- `.env.staging` - Staging configuration
- `.env.production` - Production configuration
- `.env.example` - Template file

## Configuration Usage

Import the config in your components:

```typescript
import config from '@/lib/config';

// Use environment variables
console.log(config.baseUrl);
console.log(config.environment);
console.log(config.isDevelopment);

// Feature flags
if (config.features.enableDebug) {
  console.log('Debug mode enabled');
}
```

## Deployment

### Vercel Deployment
Set environment variables in your Vercel dashboard:
- For staging: Use values from `.env.staging`
- For production: Use values from `.env.production`

### Other Platforms
Make sure to set the appropriate environment variables based on your deployment environment.

## Troubleshooting

1. **Check environment variables**:
   ```bash
   npm run env:check
   ```

2. **Environment not loading**:
   - Ensure your `.env.local` file exists
   - Check that variable names start with `NEXT_PUBLIC_`
   - Restart the development server

3. **Wrong base URL**:
   - Verify `NEXT_PUBLIC_BASE_URL` is set correctly
   - Check that the environment file is being loaded
