export type LegoSetStatus = 'mounted' | 'dismounted' | 'incomplete';
export type SubscriptionTier = 'free' | 'premium';
export type PieceStatus = 'searching' | 'found' | 'ordered';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: DatabaseTables;
    Views: DatabaseViews;
    Functions: DatabaseFunctions;
  };
}

interface DatabaseTables {
  users: {
    Row: {
      id: string;
      clerk_id: string;
      email: string;
      subscription_tier: SubscriptionTier;
      created_at: string;
      updated_at: string;
      display_name: string | null;
      avatar_url: string | null;
      preferences: Json;
    };
    Insert: Omit<DatabaseTables['users']['Row'], 'created_at' | 'updated_at'>;
    Update: Partial<DatabaseTables['users']['Insert']>;
  };
  lego_sets: {
    Row: {
      id: string;
      user_id: string;
      rebrickable_id: string;
      name: string;
      set_number: string;
      pieces_count: number;
      year: number;
      status: LegoSetStatus;
      notes: string | null;
      last_modified: string;
      created_at: string;
      image_url: string | null;
      missing_pieces_count: number;
    };
    Insert: Omit<
      DatabaseTables['lego_sets']['Row'],
      'created_at' | 'last_modified' | 'missing_pieces_count'
    >;
    Update: Partial<DatabaseTables['lego_sets']['Insert']>;
  };
  missing_pieces: {
    Row: {
      id: string;
      set_id: string;
      part_number: string;
      color: string;
      quantity: number;
      status: PieceStatus;
      purchase_url: string | null;
      created_at: string;
      updated_at: string;
      notes: string | null;
      price: number | null;
    };
    Insert: Omit<DatabaseTables['missing_pieces']['Row'], 'created_at' | 'updated_at'>;
    Update: Partial<DatabaseTables['missing_pieces']['Insert']>;
  };
}

interface DatabaseViews {
  user_statistics: {
    Row: {
      user_id: string;
      total_sets: number;
      mounted_sets: number;
      dismounted_sets: number;
      incomplete_sets: number;
      total_missing_pieces: number;
    };
  };
}

interface DatabaseFunctions {
  update_missing_pieces_count: {
    Args: { set_id: string };
    Returns: number;
  };
  search_pieces: {
    Args: { query: string };
    Returns: DatabaseTables['missing_pieces']['Row'][];
  };
}
