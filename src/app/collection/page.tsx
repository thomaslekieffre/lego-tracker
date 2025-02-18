'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { SearchSetModal } from '@/components/modals/search-set-modal';
import { ShareCollectionModal } from '@/components/share-collection-modal';
import type { RebrickableSet } from '@/types/rebrickable';
import { addLegoSet, getUserLegoSets } from '@/services/lego-sets';
import { useToast } from '@/components/ui/use-toast';
import { useDisplaySettings } from '@/stores/display-settings';

export default function CollectionPage(): React.ReactElement {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sets, setSets] = useState<any[]>([]);
  const { toast } = useToast();
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const { isCompactView, hasAnimations } = useDisplaySettings();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  const loadSets = async (): Promise<void> => {
    try {
      const userSets = await getUserLegoSets();
      setSets(userSets);
    } catch (error) {
      console.error('Erreur lors du chargement des sets:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos sets Lego',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (userId) {
      loadSets();
    }
  }, [userId]);

  const handleAddSet = async (set: RebrickableSet): Promise<void> => {
    setIsLoading(true);
    try {
      await addLegoSet(set);
      await loadSets();
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

  if (!isLoaded || !userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
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
