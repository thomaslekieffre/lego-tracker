'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDashboardStats } from '@/app/dashboard/actions';

export function ExportSettings() {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const stats = await getDashboardStats();
      const data = {
        stats,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lego-tracker-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été exportées avec succès.',
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur est survenue lors de l'export de vos données.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export des Données</CardTitle>
          <CardDescription>
            Exportez vos données de collection pour les sauvegarder ou les analyser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              L'export inclut vos statistiques de collection et la distribution de vos sets. Le
              fichier sera au format JSON pour une meilleure compatibilité.
            </p>
            <Button onClick={handleExport}>Exporter mes données</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
