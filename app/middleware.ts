import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // this middleware can be used to add authentication to admin routes
  // for now, it just passes through all requests
  return NextResponse.next()
}

export const config = {
  matcher: [
    // add routes that should be protected
    '/api/admin/:path*',
  ],
}