import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const walletConnected = request.cookies.get('wallet-connected');
    // const userRedeemed = request.cookies.get('user-redeemed');
    // console.log('Current URL: ' + request.url)
    // console.log('Request Data: ', request)
    if(request.nextUrl.pathname !== '/' && (!walletConnected || walletConnected.value != 'true')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if(request.nextUrl.pathname === '/' && (walletConnected && walletConnected.value == 'true')) {
      return NextResponse.redirect(new URL('/modules', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/modules/:path*', '/earn/:path*', '/points/:path*', '/swap/:path*', '/swap/:path*', '/liquidation/:path*'],
}