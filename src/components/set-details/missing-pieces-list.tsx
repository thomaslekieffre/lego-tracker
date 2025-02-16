'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, ExternalLink, Trash2, Download, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MissingPiece } from '@/schemas/database';
import { updateMissingPieceStatus, getPartDetails } from '@/app/collection/actions';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

type MissingPiecesListProps = {
  pieces: MissingPiece[];
  onDelete: (pieceId: string) => void;
};

type SortOption = 'date' | 'quantity' | 'status' | 'price';
type FilterStatus = 'all' | 'searching' | 'found' | 'ordered';

export function MissingPiecesList({ pieces, onDelete }: MissingPiecesListProps) {
  const [partsDetails, setPartsDetails] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function loadPartsDetails() {
      const details: Record<string, any> = {};
      for (const piece of pieces) {
        try {
          const partDetails = await getPartDetails(piece.part_number);
          details[piece.part_number] = partDetails;
        } catch (error) {
          console.error(
            `Erreur lors du chargement des détails de la pièce ${piece.part_number}:`,
            error
          );
        }
      }
      setPartsDetails(details);
    }
    loadPartsDetails();
  }, [pieces]);

  // Filtrer les pièces
  const filteredPieces = useMemo(() => {
    return pieces
      .filter((piece) => {
        const matchesStatus = filterStatus === 'all' || piece.status === filterStatus;
        const matchesSearch = searchQuery
          ? piece.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            piece.notes?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'quantity':
            return b.quantity - a.quantity;
          case 'status':
            return a.status.localeCompare(b.status);
          case 'price':
            if (!a.price && !b.price) return 0;
            if (!a.price) return 1;
            if (!b.price) return -1;
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [pieces, sortBy, filterStatus, searchQuery]);

  // Statistiques
  const stats = useMemo(() => {
    const total = pieces.length;
    const found = pieces.filter((p) => p.status === 'found').length;
    const ordered = pieces.filter((p) => p.status === 'ordered').length;
    const searching = pieces.filter((p) => p.status === 'searching').length;
    const totalCost = pieces.reduce((acc, p) => acc + (p.price || 0), 0);

    return { total, found, ordered, searching, totalCost };
  }, [pieces]);

  // Export au format CSV
  function exportToCsv() {
    const headers = ['Numéro', 'Couleur', 'Quantité', 'Statut', 'Prix', 'URL', 'Notes'];
    const rows = pieces.map((p) => [
      p.part_number,
      p.color,
      p.quantity,
      p.status,
      p.price || '',
      p.purchase_url || '',
      p.notes || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pieces-manquantes.csv';
    link.click();
  }

  // Mise à jour du statut
  async function handleStatusChange(pieceId: string, status: 'searching' | 'found' | 'ordered') {
    try {
      await updateMissingPieceStatus(pieces[0].set_id, pieceId, status);
      toast({
        title: 'Statut mis à jour',
        description: `La pièce est maintenant ${
          status === 'found' ? 'trouvée' : status === 'ordered' ? 'commandée' : 'en recherche'
        }`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-medium">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Trouvées</p>
          <p className="text-xl font-medium">{stats.found}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Commandées</p>
          <p className="text-xl font-medium">{stats.ordered}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Recherche</p>
          <p className="text-xl font-medium">{stats.searching}</p>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Rechercher une pièce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="searching">En recherche</SelectItem>
              <SelectItem value="found">Trouvée</SelectItem>
              <SelectItem value="ordered">Commandée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date d'ajout</SelectItem>
              <SelectItem value="quantity">Quantité</SelectItem>
              <SelectItem value="status">Statut</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={exportToCsv}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Liste des pièces */}
      <div className="space-y-2">
        {filteredPieces.map((piece) => (
          <motion.div
            key={piece.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
              <Image
                src={partsDetails[piece.part_number]?.part_img_url || '/placeholder-part.jpg'}
                alt={`${piece.part_number} - ${partsDetails[piece.part_number]?.name || ''}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-medium truncate">#{piece.part_number}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {partsDetails[piece.part_number]?.name || 'Chargement...'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      piece.status === 'found'
                        ? 'success'
                        : piece.status === 'ordered'
                          ? 'warning'
                          : 'default'
                    }
                    className="whitespace-nowrap"
                  >
                    {piece.status === 'found'
                      ? 'Trouvée'
                      : piece.status === 'ordered'
                        ? 'Commandée'
                        : 'Recherche'}
                  </Badge>
                  <p className="text-sm font-medium">x{piece.quantity}</p>
                </div>
              </div>
              {piece.notes && (
                <p className="text-sm text-muted-foreground truncate mt-1">{piece.notes}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {piece.purchase_url && (
                  <a
                    href={piece.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(piece.id, 'searching')}>
                      Marquer comme en recherche
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(piece.id, 'found')}>
                      Marquer comme trouvée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(piece.id, 'ordered')}>
                      Marquer comme commandée
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(piece.id)}
                      className="text-destructive"
                    >
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
