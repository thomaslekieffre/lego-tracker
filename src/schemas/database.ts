import { z } from 'zod';

// Enums
export const LegoSetStatusSchema = z.enum(['mounted', 'dismounted', 'incomplete']);
export const SubscriptionTierSchema = z.enum(['free', 'premium']);
export const PieceStatusSchema = z.enum(['searching', 'found', 'ordered']);

// Helper pour la validation des dates
const dateSchema = z.string().datetime().or(z.date());

// Base schemas
export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().min(3),
  subscription_tier: SubscriptionTierSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  display_name: z.string().min(2).max(50).nullable(),
  avatar_url: z.string().url().nullable(),
  preferences: z.record(z.unknown()).default({}),
});

export const LegoSetSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().min(1),
  rebrickable_id: z.string().min(1),
  name: z.string().min(1).max(255),
  set_number: z.string().min(1),
  pieces_count: z.number().int().min(0),
  year: z
    .number()
    .int()
    .min(1930)
    .max(new Date().getFullYear() + 1),
  status: LegoSetStatusSchema,
  notes: z.string().max(1000).nullable(),
  last_modified: dateSchema,
  created_at: dateSchema,
  image_url: z.string().url().nullable(),
  missing_pieces_count: z.number().int().min(0),
});

export const MissingPieceSchema = z.object({
  id: z.string().uuid(),
  set_id: z.string().uuid(),
  part_number: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().positive(),
  status: PieceStatusSchema,
  purchase_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  notes: z.string().max(500).nullable(),
  price: z.number().min(0).nullable(),
});

// Insert schemas (omit auto-generated fields)
export const UserInsertSchema = UserSchema.omit({
  created_at: true,
  updated_at: true,
});

export const LegoSetInsertSchema = LegoSetSchema.omit({
  created_at: true,
  last_modified: true,
  missing_pieces_count: true,
});

export const MissingPieceInsertSchema = MissingPieceSchema.omit({
  created_at: true,
  updated_at: true,
});

// Update schemas (make all fields optional except id)
export const UserUpdateSchema = UserInsertSchema.partial().required({ id: true });

export const LegoSetUpdateSchema = LegoSetInsertSchema.partial().required({ id: true });

export const MissingPieceUpdateSchema = MissingPieceInsertSchema.partial().required({ id: true });

// Statistics schema
export const UserStatisticsSchema = z.object({
  user_id: z.string().min(1),
  total_sets: z.number().int().min(0),
  mounted_sets: z.number().int().min(0),
  dismounted_sets: z.number().int().min(0),
  incomplete_sets: z.number().int().min(0),
  total_missing_pieces: z.number().int().min(0),
});

// Types dérivés des schémas
export type LegoSet = z.infer<typeof LegoSetSchema>;
export type User = z.infer<typeof UserSchema>;
export type MissingPiece = z.infer<typeof MissingPieceSchema>;
