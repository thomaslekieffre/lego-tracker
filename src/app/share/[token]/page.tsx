import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { LoadingState } from '@/components/loading-state';

export default async function SharedCollectionPage({ params }) {
  const { token } = params;
  const supabase = createServerSupabaseAdminClient();

  // 1. Récupérer le partage
  const { data: share, error: shareError } = await supabase
    .from('shared_collections')
    .select('user_id, collection_name')
    .eq('share_token', token)
    .single();

  if (shareError || !share) {
    console.error('Erreur de partage:', shareError);
    notFound();
  }

  // 2. Récupérer tous les sets de l'utilisateur
  const { data: sets, error: setsError } = await supabase
    .from('lego_sets')
    .select('*')
    .eq('user_id', share.user_id);

  if (setsError || !sets) {
    console.error('Erreur de sets:', setsError);
    notFound();
  }

  // 3. Incrémenter le compteur de vues
  await supabase.rpc('increment_views', { token });

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">{share.collection_name}</h1>
          <p className="text-muted-foreground">Collection LEGO partagée</p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sets.map((set) => (
            <LegoSetCard
              key={set.id}
              id={set.id}
              name={set.name}
              setNumber={set.set_number}
              piecesCount={set.pieces_count}
              imageUrl={set.image_url}
              status={set.status}
              missingPiecesCount={set.missing_pieces_count}
              isSharedView
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
}
