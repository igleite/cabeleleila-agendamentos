import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Rotas públicas que não requerem autenticação
  const publicPaths = ['/auth/login', '/auth/register', '/auth/verify']
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  // Se não tiver token e não estiver em uma rota pública
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se tiver token e estiver em uma rota pública
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // Se tiver token e estiver na raiz
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
