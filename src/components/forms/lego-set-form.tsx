'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const legoSetFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  setNumber: z.string().min(1, 'Le numéro de set est requis'),
  piecesCount: z.number().min(1, 'Le nombre de pièces doit être supérieur à 0'),
  year: z
    .number()
    .min(1930)
    .max(new Date().getFullYear() + 1),
  status: z.enum(['mounted', 'dismounted', 'incomplete']),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

type LegoSetFormValues = z.infer<typeof legoSetFormSchema>;

interface LegoSetFormProps {
  initialData?: Partial<LegoSetFormValues>;
  onSubmit: (data: LegoSetFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function LegoSetForm({
  initialData,
  onSubmit,
  isLoading = false,
}: LegoSetFormProps): React.ReactElement {
  const form = useForm<LegoSetFormValues>({
    resolver: zodResolver(legoSetFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      setNumber: initialData?.setNumber ?? '',
      piecesCount: initialData?.piecesCount ?? 0,
      year: initialData?.year ?? new Date().getFullYear(),
      status: initialData?.status ?? 'dismounted',
      notes: initialData?.notes ?? '',
      imageUrl: initialData?.imageUrl ?? null,
    },
  });

  const handleSubmit = async (data: LegoSetFormValues): Promise<void> => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }): React.ReactElement => (
            <FormItem>
              <FormLabel>Nom du set</FormLabel>
              <FormControl>
                <Input placeholder="Death Star" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setNumber"
          render={({ field }): React.ReactElement => (
            <FormItem>
              <FormLabel>Numéro du set</FormLabel>
              <FormControl>
                <Input placeholder="75159" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="piecesCount"
            render={({ field }): React.ReactElement => (
              <FormItem>
                <FormLabel>Nombre de pièces</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e): void => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }): React.ReactElement => (
              <FormItem>
                <FormLabel>Année</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1930}
                    max={new Date().getFullYear() + 1}
                    {...field}
                    onChange={(e): void => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }): React.ReactElement => (
            <FormItem>
              <FormLabel>État</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="mounted">Monté</option>
                  <option value="dismounted">Démonté</option>
                  <option value="incomplete">Incomplet</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }): React.ReactElement => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ajoutez des notes sur l'état du set, les pièces manquantes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }): React.ReactElement => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </form>
    </Form>
  );
}
