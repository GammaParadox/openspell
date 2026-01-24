/**
 * Type definitions for @openspell/rate-limiter
 */

import { Request, Response, NextFunction } from 'express';

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  current: number;
}

export interface RateLimiterOptions {
  host?: string;
  port?: number;
  password?: string;
  disabled?: boolean;
}

export interface MiddlewareConfig extends RateLimitConfig {
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response, result: RateLimitResult) => void;
  skipSuccessfulRequests?: boolean;
}

export class MemoryRateLimiter {
  constructor();
  checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult>;
  cleanup(): void;
}

export class RedisRateLimiter {
  constructor(redis: any);
  checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult>;
}

export class RateLimiter {
  constructor(options?: RateLimiterOptions);
  checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult>;
  createMiddleware(config: MiddlewareConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  close(): Promise<void>;
}

export function createRateLimiter(options?: RateLimiterOptions): RateLimiter;
