import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/sign-in', '/sign-up'];

// Routes d'API qui doivent être accessibles sans authentification
const publicApiRoutes = ['/api/webhooks/clerk'];

// Fonction helper pour vérifier si une route correspond à un pattern
const matchRoute = (patterns: string[], pathname: string) =>
  patterns.some((pattern) => pathname.startsWith(pattern) || pathname === pattern);

export default authMiddleware({
  publicRoutes: [...publicRoutes, ...publicApiRoutes],
  async afterAuth(auth, req: NextRequest) {
    // Gérer les routes d'API publiques
    if (matchRoute(publicApiRoutes, req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // Redirection vers la connexion pour les routes protégées
    if (!auth.userId && !matchRoute(publicRoutes, req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Redirection vers la collection pour les utilisateurs connectés qui tentent d'accéder aux pages de connexion
    if (auth.userId && matchRoute(['/sign-in', '/sign-up'], req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/collection', req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)', '/collection'],
};
