'use client';

import Link from 'next/link';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDashboardStats, getSetDistribution } from '@/app/dashboard/actions';

export function QuickActions() {
  const { toast } = useToast();

  async function handleExport() {
    try {
      // Récupérer les données du dashboard
      const stats = await getDashboardStats();
      const distribution = await getSetDistribution();

      // Formater les données pour l'export
      const data = {
        statistiques: {
          total_sets: stats.totalSets,
          sets_montes: stats.mountedSets,
          pieces_manquantes: stats.missingPieces,
          sets_incomplets: stats.incompleteSets,
        },
        distribution: distribution.map((item) => ({
          statut: item.label,
          nombre: item.count,
        })),
      };

      // Créer et télécharger le fichier
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-lego-tracker-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Les données du dashboard ont été exportées avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter les données",
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/collection">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Set
        </Link>
      </Button>

      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </div>
  );
}
