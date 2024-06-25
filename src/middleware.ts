import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const walletConnected = request.cookies.get('wallet-connected');
    const userRedeemed = request.cookies.get('user-redeemed');
    console.log('Cookie: Wallet Connected: ', walletConnected)
    console.log('Cookie: userRedeemed: ', userRedeemed)
    // if(!walletConnected || walletConnected.value != 'true' || !userRedeemed || userRedeemed.value != 'true') {
    if(!walletConnected || walletConnected.value != 'true') {
      console.log("Hello, here is middleware redirecting")
      return NextResponse.redirect(new URL('/', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/modules/:path*', '/earn/:path*', '/points/:path*', '/swap/:path*', '/referrals/:path*', '/faucet/:path*'],
}