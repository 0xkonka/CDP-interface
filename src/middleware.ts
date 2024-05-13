import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const walletConnected = request.cookies.get('wallet-connected');
    if(!walletConnected || walletConnected.value != 'true')
        return NextResponse.redirect(new URL('/', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/modules/:path*', '/earn/:path*', '/points/:path*', '/swap/:path*', '/referrals/:path*'],
}