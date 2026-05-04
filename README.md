# Matrix Software Implementation

A JavaScript library for matrix operations with a web API interface.

## Features

- Matrix addition, multiplication, transpose
- Determinant and inverse calculations
- RESTful API for programmatic access
- Web interface with examples

## Installation

```bash
npm install
```

## Usage

### As a Library

```javascript
const { addMatrices, multiplyMatrices, transposeMatrix, determinant, inverseMatrix } = require('./matrix');

// Example usage
const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];

console.log(addMatrices(A, B)); // [[6, 8], [10, 12]]
console.log(multiplyMatrices(A, B)); // [[19, 22], [43, 50]]
```

### Web API

Start the server:
```bash
npm start
```

API endpoints:
- `GET /` - API information and web interface
- `POST /add` - Add matrices
- `POST /multiply` - Multiply matrices
- `POST /transpose` - Transpose matrix
- `POST /determinant` - Calculate determinant
- `POST /inverse` - Calculate inverse

Example API call:
```bash
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{"a": [[1, 2], [3, 4]], "b": [[5, 6], [7, 8]]}'
```

## Testing

```bash
npm test
```

## Monitoring

The application includes uptime monitoring capabilities:

```bash
# Start monitoring (checks health every 5 minutes)
npm run monitor

# Or run directly
node monitor.js
```

Configure monitoring URL:
```bash
MONITOR_URL=https://your-app.vercel.app npm run monitor
```

The monitor will:
- Check `/health` endpoint every 5 minutes
- Alert after 2 consecutive failures
- Log status and response times
- Report service recovery

## Deployment

The application is configured for deployment to Vercel with automated CI/CD.

### CI/CD Pipeline

- **Test**: Runs on every push and PR
- **Staging Deploy**: Deploys PRs to staging environment for testing
- **Build**: Prepares for deployment (no build step required)
- **Deploy**: Auto-deploys to Vercel on main branch pushes
- **Smoke Tests**: Verifies deployment by checking health and API endpoints

### Environments

- **Development**: Local development with `npm start`
- **Staging**: Automatic PR deployments for testing
- **Production**: Main branch auto-deployment

### Required Secrets (GitHub Repository Settings)

Add these secrets for Vercel deployment:
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Manual Deployment

```bash
npm install -g vercel
vercel --prod
```

## Documentation

See [Docs/](Docs/) folder for detailed documentation including:
- [CI/CD Pipeline Diagram](Docs/cicd-diagram.md)
- [Security Checklist](Docs/security-checklist.md)
- [Ethics and Impact Assessment](Docs/ethics-impact.md)
- [IP and Attribution](Docs/ip-and-attribution.md)
- [Privacy Notice](Docs/privacy-note.md)
- [KPIs and Metrics](Docs/kpis.md)
- [Metrics Report](Docs/metrics-report.md)
- [Cost-Benefit Analysis](Docs/cost-benefit.md)
- [QA Plan](Docs/qa-plan.md)
- [Deployment Plan](Docs/deployment-plan.md)
- [Risk Register](Docs/risk-register.md)