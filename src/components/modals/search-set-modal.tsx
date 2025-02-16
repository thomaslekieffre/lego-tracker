'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { searchLegoSets } from '@/services/rebrickable';
import { RebrickableSet } from '@/types/rebrickable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type SearchSetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (set: RebrickableSet) => void;
};

export function SearchSetModal({
  isOpen,
  onClose,
  onSelect,
}: SearchSetModalProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RebrickableSet[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleSearch = async (term: string): Promise<void> => {
    if (!term) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchLegoSets({ search: term });
      setResults(response.results);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effectuer la recherche lorsque le terme de recherche change
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rechercher un set Lego</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou numéro de set..."
            value={searchTerm}
            onChange={(e): void => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((set) => (
                  <motion.div
                    key={set.set_num}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={set.set_img_url}
                            alt={set.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="line-clamp-2 text-sm">{set.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {set.set_num} • {set.year}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{set.num_parts} pièces</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          variant="secondary"
                          className="w-full gap-2"
                          onClick={(): void => onSelect(set)}
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
