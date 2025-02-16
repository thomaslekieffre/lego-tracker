'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LegoSet } from '@/schemas/database';
import { updateSetNotes } from '@/app/collection/actions';
import { useToast } from '@/components/ui/use-toast';

type SetNotesProps = {
  set: LegoSet;
};

const variants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

export function SetNotes({ set }: SetNotesProps) {
  const [notes, setNotes] = useState(set.notes ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  async function handleSave() {
    try {
      await updateSetNotes(set.id, notes);
      setIsEditing(false);
      toast({
        title: 'Notes mises à jour',
        description: 'Les notes ont été sauvegardées avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les notes',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Notes</p>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="space-y-2 overflow-hidden"
          >
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Sauvegarder</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNotes(set.notes ?? '');
                  setIsEditing(false);
                }}
              >
                Annuler
              </Button>
            </div>
          </motion.div>
        ) : !notes ? (
          <motion.div
            key="empty"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="overflow-hidden"
          >
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setIsEditing(true)}
            >
              Ajouter des notes...
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="overflow-hidden"
          >
            <div
              className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <p className="whitespace-pre-wrap">{notes}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
