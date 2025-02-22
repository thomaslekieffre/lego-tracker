import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LegoSetSchema } from '@/schemas/database';
import { SetDetails } from '@/components/set-details/set-details';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';

export async function generateMetadata({ params }) {
  const { id } = params;
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return {
      title: 'Set non trouvé | Lego Tracker',
    };
  }

  // Récupérer l'ID Supabase de l'utilisateur
  const { data: userData, error: userError } = await createServerSupabaseClient()
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (userError || !userData) {
    return {
      title: 'Set non trouvé | Lego Tracker',
    };
  }

  const { data: set } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userData.id)
    .single();

  if (!set) {
    return {
      title: 'Set non trouvé | Lego Tracker',
    };
  }

  return {
    title: `${set.name} | Lego Tracker`,
    description: `Détails du set ${set.set_number} - ${set.name}`,
  };
}

export default async function SetPage({ params }) {
  const { id } = params;
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    notFound();
  }

  // Récupérer l'ID Supabase de l'utilisateur
  const { data: userData, error: userError } = await createServerSupabaseClient()
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (userError || !userData) {
    notFound();
  }

  const { data: set, error } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userData.id)
    .single();

  if (error || !set) {
    notFound();
  }

  // Convertir les dates en objets Date pour la validation
  const setWithDates = {
    ...set,
    last_modified: new Date(set.last_modified),
    created_at: new Date(set.created_at),
  };

  const validatedSet = LegoSetSchema.parse(setWithDates);

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[{ label: 'Collection', href: '/collection' }, { label: validatedSet.name }]}
        className="mb-6"
      />
      <SetDetails set={validatedSet} />
    </main>
  );
}
