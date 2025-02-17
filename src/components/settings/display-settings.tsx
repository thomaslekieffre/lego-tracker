'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useDisplaySettings } from '@/stores/display-settings';

export function DisplaySettings() {
  const { isCompactView, hasAnimations, setCompactView, setAnimations } = useDisplaySettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thème</CardTitle>
          <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode sombre</Label>
              <p className="text-sm text-muted-foreground">
                Basculer entre le mode clair et sombre
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affichage de la Collection</CardTitle>
          <CardDescription>Personnalisez l'affichage de vos sets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vue compacte</Label>
              <p className="text-sm text-muted-foreground">Afficher plus de sets par ligne</p>
            </div>
            <Switch checked={isCompactView} onCheckedChange={setCompactView} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animations</Label>
              <p className="text-sm text-muted-foreground">Activer les animations de l'interface</p>
            </div>
            <Switch checked={hasAnimations} onCheckedChange={setAnimations} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
