import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/sign-in', '/sign-up'];

// Routes d'API qui doivent être accessibles sans authentification
const publicApiRoutes = ['/api/webhooks/clerk'];

// Fonction helper pour vérifier si une route correspond à un pattern
const matchRoute = (patterns: string[], pathname: string) =>
  patterns.some((pattern) => pathname.startsWith(pattern) || pathname === pattern);

export default authMiddleware({
  publicRoutes: ['/'],
  ignoredRoutes: ['/api/webhooks/(.*)'],
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

    // Si l'utilisateur n'est pas authentifié, continuer normalement
    if (!auth.userId) {
      return;
    }

    try {
      // Récupérer l'utilisateur Supabase correspondant
      const supabase = createServerSupabaseClient();
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', auth.userId)
        .single();

      // Si l'utilisateur n'existe pas dans Supabase, le créer
      if (userError && userError.code === 'PGRST116') {
        const { error: insertError } = await supabase.from('users').insert({
          clerk_id: auth.userId,
          email: auth.user?.emailAddresses[0]?.emailAddress ?? '',
          subscription_tier: 'free',
        });

        if (insertError) {
          console.error("Erreur lors de la création de l'utilisateur:", insertError);
        }
      } else if (userError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", userError);
      }
    } catch (error) {
      console.error('Erreur dans le middleware:', error);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
