import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  'Gestion illimitée de sets Lego',
  'Suivi des pièces manquantes',
  'Statistiques détaillées',
  'Synchronisation avec Rebrickable',
  'Export de données',
  'Support premium',
];

export default function Home(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative isolate">
          {/* Gradient */}
          <div
            className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Gérez votre collection Lego comme un pro
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Organisez, suivez et optimisez votre collection de Lego. Ne perdez plus jamais une
                pièce et profitez pleinement de votre passion.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sign-in">Connexion</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce qu'il vous faut
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Une suite complète d'outils pour gérer votre collection Lego de manière
              professionnelle.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="flex gap-x-3">
                  <CheckCircle2 className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  <span className="text-sm leading-6">{feature}</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Lego Tracker. Tous droits réservés.
            </p>
            <div className="flex gap-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
