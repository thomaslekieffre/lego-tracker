'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LegoSet } from '@/schemas/database';
import { updateSetStatus } from '@/app/collection/actions';
import { useToast } from '@/components/ui/use-toast';

const statusOptions = [
  { value: 'mounted', label: 'Monté', color: 'bg-green-500' },
  { value: 'dismounted', label: 'Démonté', color: 'bg-yellow-500' },
  { value: 'incomplete', label: 'Incomplet', color: 'bg-red-500' },
] as const;

type SetStatusProps = {
  set: LegoSet;
};

export function SetStatus({ set }: SetStatusProps) {
  const [status, setStatus] = useState(set.status);
  const { toast } = useToast();

  async function handleStatusChange(newStatus: typeof status) {
    try {
      await updateSetStatus(set.id, newStatus);
      setStatus(newStatus);
      toast({
        title: 'Statut mis à jour',
        description: `Le set est maintenant ${statusOptions
          .find((option) => option.value === newStatus)
          ?.label.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  }

  const currentStatus = statusOptions.find((option) => option.value === status);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Statut</p>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2"
              >
                <Badge variant="secondary" className="relative px-4 py-1 flex items-center gap-2">
                  <motion.div
                    layoutId="status-dot"
                    className={`h-2 w-2 rounded-full ${currentStatus?.color}`}
                  />
                  {currentStatus?.label}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${option.color}`} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
