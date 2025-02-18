import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { SharedCollection } from '@/types/database';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const createSharedCollection = async ({
  userId,
  setId,
  isPublic = false,
  expiresAt = null,
}: {
  userId: string;
  setId: string;
  isPublic?: boolean;
  expiresAt?: string | null;
}): Promise<SharedCollection> => {
  const shareToken = nanoid(12);

  const { data, error } = await supabaseAdmin
    .from('shared_collections')
    .insert({
      user_id: userId,
      set_id: setId,
      share_token: shareToken,
      is_public: isPublic,
      expires_at: expiresAt,
      views_count: 0,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du lien de partage: ${error.message}`);
  }

  return data;
};

export const getSharedCollectionByToken = async (
  shareToken: string
): Promise<SharedCollection | null> => {
  const { data, error } = await supabaseAdmin
    .from('shared_collections')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Erreur lors de la récupération de la collection partagée: ${error.message}`);
  }

  return data;
};

export const incrementViewCount = async (shareToken: string): Promise<void> => {
  const { error } = await supabaseAdmin.rpc('increment_views', { token: shareToken });

  if (error) {
    throw new Error(`Erreur lors de l'incrémentation du compteur de vues: ${error.message}`);
  }
};

export const syncUser = async (clerkId: string, email: string) => {
  try {
    // D'abord, essayer de récupérer l'utilisateur existant
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    // Si l'utilisateur existe, le retourner
    if (existingUser) {
      return existingUser;
    }

    // Si l'erreur n'est pas "not found", la propager
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Si l'utilisateur n'existe pas, le créer
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_id: clerkId,
        email,
        subscription_tier: 'free',
      })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    return newUser;
  } catch (error) {
    console.error("Erreur lors de la synchronisation de l'utilisateur:", error);
    throw new Error(
      `Erreur lors de la synchronisation de l'utilisateur: ${
        error instanceof Error ? error.message : 'Erreur inconnue'
      }`
    );
  }
};
