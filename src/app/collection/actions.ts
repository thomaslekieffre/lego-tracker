'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { RebrickableSet } from '@/types/rebrickable';
import {
  LegoSetInsertSchema,
  LegoSetStatusSchema,
  MissingPieceInsertSchema,
  MissingPieceSchema,
} from '@/schemas/database';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { rebrickableClient, RebrickablePart } from '@/lib/rebrickable';
import { nanoid } from 'nanoid';

export async function addLegoSet(rebrickableSet: RebrickableSet): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'utilisateur Supabase correspondant
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erreur lors de la récupération de l'utilisateur:", userError);
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    const newSet = LegoSetInsertSchema.parse({
      id: randomUUID(),
      user_id: userData.id,
      rebrickable_id: rebrickableSet.set_num,
      name: rebrickableSet.name,
      set_number: rebrickableSet.set_num,
      pieces_count: rebrickableSet.num_parts,
      year: rebrickableSet.year,
      status: 'dismounted',
      notes: '',
      image_url: rebrickableSet.set_img_url || null,
    });

    const { error } = await createServerSupabaseClient()
      .from('lego_sets')
      .insert([newSet])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error("Erreur lors de l'ajout du set");
    }
  } catch (error) {
    console.error("Erreur lors de la validation ou de l'insertion:", error);
    throw error;
  }
}

export async function getUserLegoSets(): Promise<any[]> {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erreur lors de la récupération de l'utilisateur:", userError);
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    // Récupérer les sets avec l'ID Supabase
    const { data, error } = await createServerSupabaseClient()
      .from('lego_sets')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la récupération des sets');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sets:', error);
    throw error;
  }
}

export async function updateSetStatus(
  setId: string,
  status: 'mounted' | 'dismounted' | 'incomplete'
): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    const validatedStatus = LegoSetStatusSchema.parse(status);

    const { error } = await createServerSupabaseClient()
      .from('lego_sets')
      .update({
        status: validatedStatus,
        last_modified: new Date().toISOString(),
      })
      .eq('id', setId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }

    revalidatePath('/collection/[id]', 'page');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
}

export async function updateSetNotes(setId: string, notes: string): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    const { error } = await createServerSupabaseClient()
      .from('lego_sets')
      .update({
        notes,
        last_modified: new Date().toISOString(),
      })
      .eq('id', setId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la mise à jour des notes');
    }

    revalidatePath('/collection/[id]', 'page');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
}

export async function getMissingPieces(setId: string): Promise<any[]> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    // Vérifier que l'utilisateur possède bien le set
    const { data: setData, error: setError } = await createServerSupabaseClient()
      .from('lego_sets')
      .select('id')
      .eq('id', setId)
      .eq('user_id', userData.id)
      .single();

    if (setError || !setData) {
      throw new Error('Set non trouvé ou non autorisé');
    }

    const { data, error } = await createServerSupabaseClient()
      .from('missing_pieces')
      .select('*')
      .eq('set_id', setId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la récupération des pièces manquantes');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des pièces:', error);
    throw error;
  }
}

export async function addMissingPiece(
  setId: string,
  piece: {
    part_number: string;
    color: string;
    quantity: number;
    status?: 'searching' | 'found' | 'ordered';
    purchase_url?: string;
    notes?: string;
    price?: number;
  }
): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await createServerSupabaseClient()
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    // Vérifier que l'utilisateur possède bien le set
    const { data: setData, error: setError } = await createServerSupabaseClient()
      .from('lego_sets')
      .select('id')
      .eq('id', setId)
      .eq('user_id', userData.id)
      .single();

    if (setError || !setData) {
      throw new Error('Set non trouvé ou non autorisé');
    }

    const newPiece = MissingPieceInsertSchema.parse({
      id: randomUUID(),
      set_id: setId,
      part_number: piece.part_number,
      color: piece.color,
      quantity: piece.quantity,
      status: piece.status || 'searching',
      purchase_url: piece.purchase_url || null,
      notes: piece.notes || null,
      price: piece.price || null,
    });

    const { error } = await createServerSupabaseClient().from('missing_pieces').insert([newPiece]);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error("Erreur lors de l'ajout de la pièce");
    }

    revalidatePath('/collection/[id]', 'page');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
}

export async function deleteMissingPiece(setId: string, pieceId: string): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Vérifier que l'utilisateur possède bien le set
    const { data: setData, error: setError } = await createServerSupabaseClient()
      .from('lego_sets')
      .select('id')
      .eq('id', setId)
      .eq('user_id', userId)
      .single();

    if (setError || !setData) {
      throw new Error('Set non trouvé ou non autorisé');
    }

    // Récupérer la quantité de la pièce avant suppression
    const { data: pieceData, error: pieceError } = await createServerSupabaseClient()
      .from('missing_pieces')
      .select('quantity')
      .eq('id', pieceId)
      .eq('set_id', setId)
      .single();

    if (pieceError || !pieceData) {
      throw new Error('Pièce non trouvée');
    }

    const { error } = await createServerSupabaseClient()
      .from('missing_pieces')
      .delete()
      .eq('id', pieceId)
      .eq('set_id', setId);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la suppression de la pièce');
    }

    revalidatePath('/collection/[id]', 'page');
  } catch (error) {
    console.error('Erreur lors de la suppression de la pièce:', error);
    throw error;
  }
}

export async function updateMissingPieceStatus(
  setId: string,
  pieceId: string,
  status: 'searching' | 'found' | 'ordered',
  purchaseUrl?: string,
  price?: number
): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Vérifier que l'utilisateur possède bien le set
    const { data: setData, error: setError } = await createServerSupabaseClient()
      .from('lego_sets')
      .select('id')
      .eq('id', setId)
      .eq('user_id', userId)
      .single();

    if (setError || !setData) {
      throw new Error('Set non trouvé ou non autorisé');
    }

    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (purchaseUrl !== undefined) {
      updateData.purchase_url = purchaseUrl;
    }

    if (price !== undefined) {
      updateData.price = price;
    }

    const { error } = await createServerSupabaseClient()
      .from('missing_pieces')
      .update(updateData)
      .eq('id', pieceId)
      .eq('set_id', setId);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }

    revalidatePath('/collection/[id]', 'page');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
}

export async function searchParts(query: string): Promise<RebrickablePart[]> {
  try {
    return await rebrickableClient.searchParts(query);
  } catch (error) {
    console.error('Erreur lors de la recherche de pièces:', error);
    throw error;
  }
}

export async function getPartColors(partNum: string): Promise<any[]> {
  try {
    return await rebrickableClient.getPartColors(partNum);
  } catch (error) {
    console.error('Erreur lors de la récupération des couleurs:', error);
    throw error;
  }
}

export async function getPartDetails(partNum: string) {
  try {
    return await rebrickableClient.getPartDetails(partNum);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la pièce:', error);
    throw error;
  }
}

export async function createShareToken(isPublic: boolean = false): Promise<string> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Non authentifié');
  }

  try {
    const supabase = createServerSupabaseAdminClient();
    const shareToken = nanoid(12);

    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erreur lors de la récupération de l'utilisateur:", userError);
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    console.log('Tentative de création du partage avec:', {
      user_id: userData.id,
      share_token: shareToken,
      is_public: isPublic,
    });

    // Insertion avec retour des données
    const { data: share, error: insertError } = await supabase
      .from('shared_collections')
      .insert({
        user_id: userData.id,
        share_token: shareToken,
        is_public: isPublic,
        views_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur lors de l'insertion:", insertError);
      throw new Error('Erreur lors de la création du partage');
    }

    console.log('Partage créé avec succès:', share);
    return shareToken;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw error instanceof Error ? error : new Error('Erreur lors de la création du partage');
  }
}
