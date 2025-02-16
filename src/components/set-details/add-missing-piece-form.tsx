'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { LegoSet, MissingPiece } from '@/schemas/database';
import { useToast } from '@/components/ui/use-toast';
import { addMissingPiece, searchParts, getPartColors } from '@/app/collection/actions';
import Image from 'next/image';

type AddMissingPieceFormProps = {
  set: LegoSet;
  trigger?: React.ReactNode;
  onAdd?: (piece: MissingPiece) => void;
};

type FormData = {
  part_number: string;
  quantity: number;
  notes?: string;
};

type RebrickablePart = {
  part_num: string;
  name: string;
  part_img_url: string | null;
  part_url: string;
};

export function AddMissingPieceForm({ set, trigger, onAdd }: AddMissingPieceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RebrickablePart[]>([]);
  const [selectedPart, setSelectedPart] = useState<RebrickablePart | null>(null);
  const [formData, setFormData] = useState<FormData>({
    part_number: '',
    quantity: 1,
    notes: '',
  });
  const { toast } = useToast();

  // Recherche de pièces avec debounce
  useEffect(() => {
    let isActive = true;
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        try {
          setIsLoading(true);
          const results = await searchParts(searchQuery);
          if (isActive) {
            setSearchResults(results);
          }
        } catch (error) {
          if (isActive) {
            toast({
              title: 'Erreur',
              description: 'Impossible de rechercher les pièces',
              variant: 'destructive',
            });
            setSearchResults([]);
          }
        } finally {
          if (isActive) {
            setTimeout(() => setIsLoading(false), 300);
          }
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [searchQuery, toast]);

  // Réinitialiser les résultats quand la recherche est vide
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setSelectedPart(null);
      setIsLoading(false);
    }
  }, [searchQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.part_number) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une pièce',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await addMissingPiece(set.id, {
        part_number: formData.part_number,
        color: formData.notes || 'Rouge',
        quantity: formData.quantity,
        notes: selectedPart?.name || '',
      });

      toast({
        title: 'Pièce ajoutée',
        description: 'La pièce a été ajoutée avec succès',
      });

      // Réinitialiser le formulaire
      setFormData({
        part_number: '',
        quantity: 1,
        notes: '',
      });
      setSelectedPart(null);
      setSearchQuery('');
      setSearchResults([]);

      // Fermer le dialogue
      setIsOpen(false);

      // Notifier le parent
      if (onAdd) {
        onAdd({
          id: 'temp-id',
          set_id: set.id,
          part_number: formData.part_number,
          color: formData.notes || 'Pas de notes',
          quantity: formData.quantity,
          status: 'searching',
          notes: formData.notes || null,
          purchase_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          price: null,
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter la pièce",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Ajouter une pièce
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une pièce manquante</DialogTitle>
          <DialogDescription>
            Ajoutez une pièce manquante à votre set {set.name} (#{set.set_number})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Rechercher une pièce</Label>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Numéro ou nom de la pièce..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                disabled={isLoading}
              />
              <CommandList>
                {isLoading ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Recherche en cours...
                  </div>
                ) : searchQuery.length < 3 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Entrez au moins 3 caractères...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Aucun résultat
                  </div>
                ) : (
                  <CommandGroup>
                    {searchResults.map((part) => (
                      <CommandItem
                        key={part.part_num}
                        value={part.part_num}
                        onSelect={() => {
                          setSelectedPart(part);
                          setFormData((d) => ({ ...d, part_number: part.part_num }));
                        }}
                        className="flex items-center gap-3"
                      >
                        {part.part_img_url && (
                          <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                            <Image
                              src={part.part_img_url}
                              alt={part.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-muted-foreground">#{part.part_num}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>

          {/* Détails de la pièce */}
          {selectedPart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4 rounded-lg border p-4">
                {selectedPart.part_img_url && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={selectedPart.part_img_url}
                      alt={selectedPart.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{selectedPart.name}</h4>
                  <p className="text-sm text-muted-foreground">#{selectedPart.part_num}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité manquante</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-24"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, quantity: parseInt(e.target.value) || 1 }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (couleur, etc.)</Label>
                <Input
                  id="notes"
                  placeholder="Couleur et autres informations..."
                  value={formData.notes}
                  onChange={(e) => setFormData((d) => ({ ...d, notes: e.target.value }))}
                />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !selectedPart}>
              {isLoading ? 'Ajout en cours...' : 'Ajouter la pièce'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
