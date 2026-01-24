# @openspell/rate-limiter

Redis-based rate limiting with automatic fallback to in-memory limiting.

## Features

- **Redis-backed**: Uses Redis sorted sets for distributed rate limiting
- **Automatic Fallback**: Falls back to in-memory limiting if Redis is unavailable
- **Sliding Window**: Accurate rate limiting using sliding window algorithm
- **Express Middleware**: Easy-to-use Express middleware factory
- **Per-Identifier**: Track limits by IP, userId, or any custom identifier

## Installation

```bash
npm install @openspell/rate-limiter
```

## Usage

### Basic Setup

```javascript
const { createRateLimiter } = require('@openspell/rate-limiter');

const rateLimiter = createRateLimiter({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  disabled: process.env.REDIS_DISABLED === 'true'
});
```

### Express Middleware

```javascript
const loginLimiter = rateLimiter.createMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 requests per window
  keyPrefix: 'login',
  message: 'Too many login attempts',
  keyGenerator: (req) => req.ip
});

app.post('/login', loginLimiter, (req, res) => {
  // Login logic
});
```

### Custom Handler

```javascript
const registerLimiter = rateLimiter.createMiddleware({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyPrefix: 'register',
  handler: (req, res, result) => {
    res.redirect(`/register?error=${encodeURIComponent('Too many attempts')}`);
  }
});
```

### Direct API

```javascript
const result = await rateLimiter.checkLimit(
  req.ip,
  {
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyPrefix: 'api'
  }
);

if (!result.allowed) {
  return res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: result.resetAt
  });
}
```

## Configuration

### Rate Limiter Options

- `host` (string): Redis host (default: 'localhost')
- `port` (number): Redis port (default: 6379)
- `password` (string): Redis password
- `disabled` (boolean): If true, uses in-memory fallback (default: false)

### Middleware Options

- `windowMs` (number): Time window in milliseconds
- `max` (number): Maximum requests per window
- `keyPrefix` (string): Redis key prefix for this limiter
- `message` (string): Error message (default: 'Too many requests, please try again later.')
- `statusCode` (number): HTTP status code (default: 429)
- `keyGenerator` (function): Function to extract identifier from request (default: uses IP)
- `handler` (function): Custom handler for rate limit exceeded
- `skipSuccessfulRequests` (boolean): Only count failed requests (default: false)

## Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_DISABLED=false
```

## How It Works

### Sliding Window Algorithm

The rate limiter uses Redis sorted sets to implement a sliding window:

1. Each request is stored with its timestamp as the score
2. Old requests outside the window are automatically removed
3. Current count is checked against the limit
4. New request is added if allowed

This provides accurate rate limiting without the "reset spike" problem of fixed windows.

### Automatic Fallback

If Redis becomes unavailable:

1. The limiter automatically falls back to in-memory tracking
2. Per-process limits are enforced (not ideal for multi-instance, but better than nothing)
3. Memory is cleaned up periodically to prevent leaks

## Production Considerations

- Use Redis in production for distributed rate limiting across multiple instances
- Set appropriate `windowMs` and `max` values for your use case
- Monitor Redis health and set up alerts
- Consider using Redis Cluster for high availability
- Set `REDIS_PASSWORD` for security

## License

MIT
