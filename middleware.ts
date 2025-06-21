import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// initialize redis client once per runtime instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// create rate limiters with different limits
const playLimiter = new Ratelimit({
  redis,
  // 5 requests per 60-second sliding window
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/play',
})

const adminLimiter = new Ratelimit({
  redis,
  // 30 requests per 60-second sliding window
  limiter: Ratelimit.slidingWindow(30, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/admin',
})

// helper to resolve the client IP reliably in most environments
function getClientIp(request: NextRequest): string {
  // when deployed, vercel/edge provides x-forwarded-for with the user ip
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  // fallback to remote address in dev
  return '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  const ip = getClientIp(request)

  // rate-limit public play endpoint
  if (request.nextUrl.pathname === '/api/play' || request.nextUrl.pathname.startsWith('/api/play/')) {
    const { success, limit, reset, remaining } = await playLimiter.limit(ip)

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        },
      )
    }
  }

  // protect admin namespace (cookie-based auth + higher limit)
  if (request.nextUrl.pathname.startsWith('/api/admin') && request.nextUrl.pathname !== '/api/admin/login') {
    const adminCookie = request.cookies.get('admin_auth')
    if (!adminCookie || adminCookie.value !== 'true') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { success } = await adminLimiter.limit(ip)
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/play/:path*', '/api/admin/:path*'],
}