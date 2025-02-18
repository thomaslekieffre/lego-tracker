import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { notFound } from 'next/navigation';

interface SharedCollectionPageProps {
  params: {
    token: string;
  };
}

export default async function SharedCollectionPage({ params }: SharedCollectionPageProps) {
  const { token } = params;

  // Récupérer les informations de partage
  const { data: shareData, error: shareError } = await createServerSupabaseClient()
    .from('shared_collections')
    .select('*, users:user_id(email)')
    .eq('share_token', token)
    .single();

  if (shareError || !shareData) {
    notFound();
  }

  // Vérifier si la collection est publique
  if (!shareData.is_public) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Collection privée</h1>
          <p className="text-muted-foreground">
            Cette collection n'est pas publique. Demandez à son propriétaire de la rendre publique
            pour y accéder.
          </p>
        </div>
      </div>
    );
  }

  // Récupérer les sets de la collection
  const { data: sets, error: setsError } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('*')
    .eq('user_id', shareData.user_id)
    .order('created_at', { ascending: false });

  if (setsError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Erreur</h1>
          <p className="text-muted-foreground">
            Une erreur est survenue lors de la récupération de la collection.
          </p>
        </div>
      </div>
    );
  }

  // Incrémenter le compteur de vues
  await createServerSupabaseClient().rpc('increment_views', { token });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{shareData.collection_name}</h1>
        <p className="text-muted-foreground mt-2">
          Collection partagée par {shareData.users.email} • {sets.length} sets
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
