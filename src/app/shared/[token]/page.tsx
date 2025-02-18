import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function SharedCollectionPage({ params }) {
  const { token } = params;

  // Récupérer les informations de partage
  const { data: shareData, error: shareError } = await createServerSupabaseClient()
    .from('shared_collections')
    .select('*, users:user_id(email), lego_sets:set_id(*)')
    .eq('share_token', token)
    .single();

  if (shareError || !shareData) {
    notFound();
  }

  // Vérifier si la collection est publique
  if (!shareData.is_public) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Collection privée</h1>
          <p className="text-muted-foreground">
            Cette collection n'est pas publique. Demandez à son propriétaire de la rendre publique
            pour y accéder.
          </p>
        </div>
      </div>
    );
  }

  // Incrémenter le compteur de vues
  await createServerSupabaseClient().rpc('increment_views', { token });

  const set = shareData.lego_sets;

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">{set.name}</h1>
          <p className="text-muted-foreground">Set partagé par {shareData.users.email}</p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1">
          <LegoSetCard
            id={set.id}
            name={set.name}
            setNumber={set.set_number}
            piecesCount={set.pieces_count}
            imageUrl={set.image_url}
            status={set.status}
            missingPiecesCount={set.missing_pieces_count}
            isSharedView
          />
        </div>
      </div>
    </Suspense>
  );
}
