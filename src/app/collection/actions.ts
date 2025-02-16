'use server';

import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { RebrickableSet } from '@/types/rebrickable';
import { LegoSetInsertSchema } from '@/schemas/database';
import { randomUUID } from 'crypto';

export async function addLegoSet(rebrickableSet: RebrickableSet): Promise<void> {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  try {
    // Récupérer l'utilisateur Supabase correspondant
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('clerk_id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erreur lors de la récupération de l'utilisateur:", userError);
      throw new Error('Utilisateur non trouvé dans Supabase');
    }

    const newSet = LegoSetInsertSchema.parse({
      id: randomUUID(),
      user_id: userData.clerk_id,
      rebrickable_id: rebrickableSet.set_num,
      name: rebrickableSet.name,
      set_number: rebrickableSet.set_num,
      pieces_count: rebrickableSet.num_parts,
      year: rebrickableSet.year,
      status: 'dismounted',
      notes: '',
      image_url: rebrickableSet.set_img_url || null,
    });

    const { error } = await supabaseAdmin.from('lego_sets').insert([newSet]).select().single();

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

    const { data, error } = await supabaseAdmin
      .from('lego_sets')
      .select('*')
      .eq('user_id', userId)
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
