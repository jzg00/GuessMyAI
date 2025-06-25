import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  console.log('Admin login attempt - provided password:', password ? 'provided' : 'missing')
  console.log('Admin login attempt - expected password:', process.env.ADMIN_PASSWORD ? 'set' : 'missing')

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    console.log('Password mismatch - provided:', password, 'expected:', process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  console.log('Admin login successful')
  const response = NextResponse.json({ message: 'Authenticated' })
  response.cookies.set({
    name: 'admin_auth',
    value: 'true',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })
  return response
}