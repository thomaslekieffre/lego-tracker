'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { LegoSet, MissingPiece } from '@/schemas/database';
import { AddMissingPieceForm } from './add-missing-piece-form';
import { MissingPiecesList } from './missing-pieces-list';
import { useToast } from '@/components/ui/use-toast';
import { getMissingPieces, deleteMissingPiece } from '@/app/collection/actions';

type MissingPiecesProps = {
  set: LegoSet;
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function MissingPieces({ set }: MissingPiecesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pieces, setPieces] = useState<MissingPiece[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadPieces();
    }
  }, [isOpen, set.id]);

  async function loadPieces() {
    try {
      setIsLoading(true);
      const data = await getMissingPieces(set.id);
      setPieces(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les pièces manquantes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(pieceId: string) {
    try {
      await deleteMissingPiece(set.id, pieceId);
      setPieces((current) => current.filter((p) => p.id !== pieceId));
      toast({
        title: 'Pièce supprimée',
        description: 'La pièce a été supprimée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la pièce',
        variant: 'destructive',
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 transition-colors">
          <Box className="h-4 w-4" />
          {set.missing_pieces_count > 0 ? (
            <span>
              {set.missing_pieces_count} pièce{set.missing_pieces_count > 1 ? 's' : ''} manquante
              {set.missing_pieces_count > 1 ? 's' : ''}
            </span>
          ) : (
            'Gérer les pièces manquantes'
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Pièces manquantes</SheetTitle>
          <SheetDescription>
            Gérez les pièces manquantes de votre set {set.name} (#{set.set_number})
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Liste des pièces manquantes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Liste des pièces</h3>
              <AddMissingPieceForm
                set={set}
                onAdd={(piece) => {
                  setPieces((current) => [piece, ...current]);
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-md border border-muted bg-muted/10 animate-pulse"
                    />
                  ))}
                </motion.div>
              ) : pieces.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="rounded-md border border-dashed p-8 text-center"
                >
                  <Box className="mx-auto h-8 w-8 text-muted-foreground/60" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune pièce manquante pour ce set
                  </p>
                  <AddMissingPieceForm
                    set={set}
                    onAdd={(piece) => {
                      setPieces((current) => [piece, ...current]);
                    }}
                    trigger={
                      <Button variant="outline" size="sm" className="mt-4">
                        Ajouter une pièce manquante
                      </Button>
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <MissingPiecesList pieces={pieces} onDelete={handleDelete} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button variant="outline">Fermer</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
