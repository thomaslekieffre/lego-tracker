'use server';

import { auth } from '@clerk/nextjs';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { subMonths, subWeeks, startOfDay } from 'date-fns';

export type DashboardStats = {
  totalSets: number;
  mountedSets: number;
  missingPieces: number;
  incompleteSets: number;
};

export type SetDistribution = {
  status: 'mounted' | 'dismounted' | 'incomplete';
  count: number;
  label: string;
};

export type RecentActivity = {
  id: string;
  type: 'set_status' | 'piece_status' | 'set_added' | 'piece_added';
  timestamp: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  // Récupérer les statistiques actuelles
  const { data: currentStats, error: statsError } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('status, missing_pieces_count')
    .eq('user_id', userId);

  if (statsError) {
    throw new Error('Erreur lors de la récupération des statistiques');
  }

  // Statistiques actuelles
  const totalSets = currentStats.length;
  const mountedSets = currentStats.filter((set) => set.status === 'mounted').length;
  const incompleteSets = currentStats.filter((set) => set.status === 'incomplete').length;
  const missingPieces = currentStats.reduce(
    (total, set) => total + (set.missing_pieces_count || 0),
    0
  );

  return {
    totalSets,
    mountedSets,
    missingPieces,
    incompleteSets,
  };
}

export async function getSetDistribution(): Promise<SetDistribution[]> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  const { data: stats, error: statsError } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('status')
    .eq('user_id', userId);

  if (statsError) {
    throw new Error('Erreur lors de la récupération de la distribution');
  }

  const distribution = [
    { status: 'mounted', count: 0, label: 'Montés' },
    { status: 'dismounted', count: 0, label: 'Démontés' },
    { status: 'incomplete', count: 0, label: 'Incomplets' },
  ] as SetDistribution[];

  // Compter les sets par statut
  stats.forEach((set) => {
    const status = distribution.find((d) => d.status === set.status);
    if (status) {
      status.count++;
    }
  });

  return distribution;
}

export async function getRecentActivity(limit = 5): Promise<RecentActivity[]> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  // Récupérer les dernières modifications de sets
  const { data: setUpdates, error: setError } = await createServerSupabaseClient()
    .from('lego_sets')
    .select('*')
    .eq('user_id', userId)
    .order('last_modified', { ascending: false })
    .limit(limit);

  if (setError) {
    throw new Error('Erreur lors de la récupération des activités récentes');
  }

  // Récupérer les dernières modifications de pièces
  const { data: pieceUpdates, error: pieceError } = await createServerSupabaseClient()
    .from('missing_pieces')
    .select('*, lego_sets!inner(*)')
    .eq('lego_sets.user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (pieceError) {
    throw new Error('Erreur lors de la récupération des activités de pièces');
  }

  // Combiner et formater les activités
  const activities: RecentActivity[] = [
    ...setUpdates.map((set) => ({
      id: `set-${set.id}`,
      type: 'set_status' as const,
      timestamp: set.last_modified,
      title: 'Set mis à jour',
      description: `${set.name} - ${
        set.status === 'mounted' ? 'Monté' : set.status === 'dismounted' ? 'Démonté' : 'Incomplet'
      }`,
      metadata: {
        setId: set.id,
        status: set.status,
      },
    })),
    ...pieceUpdates.map((piece) => ({
      id: `piece-${piece.id}`,
      type: 'piece_status' as const,
      timestamp: piece.updated_at,
      title: `Pièce ${
        piece.status === 'found'
          ? 'trouvée'
          : piece.status === 'ordered'
            ? 'commandée'
            : 'en recherche'
      }`,
      description: `${piece.part_number} - ${piece.lego_sets.name}`,
      metadata: {
        pieceId: piece.id,
        setId: piece.set_id,
        status: piece.status,
      },
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return activities;
}
