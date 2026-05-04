const express = require('express');
require('dotenv').config(); // Load environment variables
const { addMatrices, multiplyMatrices, transposeMatrix, determinant, inverseMatrix } = require('./matrix');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Basic authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Simple token validation (in production, use proper JWT or database validation)
  const validTokens = process.env.VALID_TOKENS ? process.env.VALID_TOKENS.split(',') : ['demo-token-123'];

  if (!validTokens.includes(token)) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  next();
};

// Input validation middleware for matrix operations
const validateMatrixInput = (req, res, next) => {
  const { body } = req;

  // Check if request has body
  if (!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  // Validate matrices are arrays
  const validateMatrix = (matrix, fieldName) => {
    if (!Array.isArray(matrix)) {
      return `${fieldName} must be an array`;
    }
    if (matrix.length === 0) {
      return `${fieldName} cannot be empty`;
    }
    for (let i = 0; i < matrix.length; i++) {
      if (!Array.isArray(matrix[i])) {
        return `${fieldName}[${i}] must be an array (row)`;
      }
      if (matrix[i].length === 0) {
        return `${fieldName}[${i}] cannot be empty`;
      }
      // Check all elements are numbers
      for (let j = 0; j < matrix[i].length; j++) {
        if (typeof matrix[i][j] !== 'number' || isNaN(matrix[i][j])) {
          return `${fieldName}[${i}][${j}] must be a valid number`;
        }
      }
    }
    return null;
  };

  let error = null;

  // Validate based on endpoint
  if (req.path === '/add' || req.path === '/multiply') {
    if (!body.a || !body.b) {
      error = 'Both matrices "a" and "b" are required';
    } else {
      error = validateMatrix(body.a, 'Matrix a') || validateMatrix(body.b, 'Matrix b');
    }
  } else if (req.path === '/transpose' || req.path === '/determinant' || req.path === '/inverse') {
    if (!body.matrix) {
      error = 'Matrix is required in "matrix" field';
    } else {
      error = validateMatrix(body.matrix, 'Matrix');
    }
  }

  if (error) {
    return res.status(400).json({ error });
  }

  next();
};

app.use(express.json({ limit: '10mb' })); // Limit request size

// API endpoints first (before static files)
app.get('/', (req, res) => {
  // Check if client accepts JSON
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({
      message: 'Matrix Software Implementation API',
      version: '1.0.0',
      endpoints: {
        'GET /': 'This info (public)',
        'GET /health': 'Health check (public)',
        'POST /add': 'Add two matrices (requires auth)',
        'POST /multiply': 'Multiply two matrices (requires auth)',
        'POST /transpose': 'Transpose a matrix (requires auth)',
        'POST /determinant': 'Calculate determinant (requires auth)',
        'POST /inverse': 'Calculate inverse (requires auth)'
      },
      auth: 'Use Bearer token in Authorization header'
    });
  } else {
    // Serve HTML for browsers
    res.sendFile(__dirname + '/public/index.html');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Serve static files (for potential frontend) - but not for root
app.use('/static', express.static('public'));

// Protected endpoints (require authentication)
app.use('/add', authenticate);
app.use('/multiply', authenticate);
app.use('/transpose', authenticate);
app.use('/determinant', authenticate);
app.use('/inverse', authenticate);

// Apply input validation to all matrix endpoints
app.use('/add', validateMatrixInput);
app.use('/multiply', validateMatrixInput);
app.use('/transpose', validateMatrixInput);
app.use('/determinant', validateMatrixInput);
app.use('/inverse', validateMatrixInput);

app.post('/add', (req, res) => {
  const { a, b } = req.body;
  const result = addMatrices(a, b);
  res.json({ result });
});

app.post('/multiply', (req, res) => {
  const { a, b } = req.body;
  const result = multiplyMatrices(a, b);
  res.json({ result });
});

app.post('/transpose', (req, res) => {
  const { matrix } = req.body;
  const result = transposeMatrix(matrix);
  res.json({ result });
});

app.post('/determinant', (req, res) => {
  const { matrix } = req.body;
  const result = determinant(matrix);
  res.json({ result });
});

app.post('/inverse', (req, res) => {
  const { matrix } = req.body;
  const result = inverseMatrix(matrix);
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Matrix API server running on port ${PORT}`);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.path} - ${error.message}`);

  // Don't expose stack traces in production
  res.status(500).json({
    error: 'Internal server error',
    timestamp: timestamp
  });
});

// 404 handler
app.use((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 404 ${req.method} ${req.path} - ${req.ip}`);

  res.status(404).json({
    error: 'Endpoint not found',
    timestamp: timestamp
  });
});

module.exports = app;