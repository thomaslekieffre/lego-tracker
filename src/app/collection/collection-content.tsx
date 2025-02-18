'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { SearchSetModal } from '@/components/modals/search-set-modal';
import { ShareCollectionModal } from '@/components/share-collection-modal';
import type { RebrickableSet } from '@/types/rebrickable';
import { addLegoSet } from '@/services/lego-sets';
import { useToast } from '@/components/ui/use-toast';
import { useDisplaySettings } from '@/stores/display-settings';
import type { DatabaseTables } from '@/types/database';

interface CollectionContentProps {
  initialSets: DatabaseTables['lego_sets']['Row'][];
}

export function CollectionContent({ initialSets }: CollectionContentProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sets, setSets] = useState(initialSets);
  const { toast } = useToast();
  const { isCompactView, hasAnimations } = useDisplaySettings();

  const handleAddSet = async (set: RebrickableSet): Promise<void> => {
    setIsLoading(true);
    try {
      await addLegoSet(set);
      // Recharger la page pour obtenir les données à jour
      window.location.reload();
      setIsSearchModalOpen(false);
      toast({
        title: 'Succès',
        description: 'Le set a été ajouté à votre collection',
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du set:", error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le set à votre collection",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas de sets, afficher un message
  if (!sets || sets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Ma Collection</h1>
          <Button
            onClick={(): void => setIsSearchModalOpen(true)}
            className="gap-2 w-full sm:w-auto"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Ajouter un set
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Votre collection est vide. Ajoutez votre premier set !
          </p>
        </div>
        <SearchSetModal
          isOpen={isSearchModalOpen}
          onClose={(): void => setIsSearchModalOpen(false)}
          onSelect={handleAddSet}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Ma Collection</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <ShareCollectionModal className="w-full sm:w-auto" />
          <Button
            onClick={(): void => setIsSearchModalOpen(true)}
            className="gap-2 w-full sm:w-auto"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Ajouter un set
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-4 md:gap-6 ${
          isCompactView
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {sets.map((set) => (
          <motion.div
            key={set.id}
            layout={hasAnimations}
            initial={hasAnimations ? { opacity: 0, y: 20 } : false}
            animate={hasAnimations ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3 }}
          >
            <LegoSetCard
              id={set.id}
              name={set.name}
              setNumber={set.set_number}
              piecesCount={set.pieces_count}
              imageUrl={set.image_url}
              status={set.status}
              missingPiecesCount={set.missing_pieces_count}
              isCompact={isCompactView}
            />
          </motion.div>
        ))}
      </div>

      <SearchSetModal
        isOpen={isSearchModalOpen}
        onClose={(): void => setIsSearchModalOpen(false)}
        onSelect={handleAddSet}
      />
    </div>
  );
}
