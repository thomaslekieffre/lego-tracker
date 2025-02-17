'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LegoSetCard } from '@/components/cards/lego-set-card';
import { SearchSetModal } from '@/components/modals/search-set-modal';
import type { RebrickableSet } from '@/types/rebrickable';
import { addLegoSet, getUserLegoSets } from '@/services/lego-sets';
import { useToast } from '@/components/ui/use-toast';

export default function CollectionPage(): React.ReactElement {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sets, setSets] = useState<any[]>([]);
  const { toast } = useToast();
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

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
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ma Collection</h1>
        <Button onClick={(): void => setIsSearchModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un set
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <LegoSetCard
            key={set.id}
            id={set.id}
            name={set.name}
            setNumber={set.set_number}
            piecesCount={set.pieces_count}
            imageUrl={set.image_url}
            status={set.status}
            missingPiecesCount={set.missing_pieces_count}
          />
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
