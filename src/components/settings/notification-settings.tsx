'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications par Email</CardTitle>
          <CardDescription>Gérez vos préférences de notifications par email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pièces trouvées</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir une notification quand une pièce de votre wishlist est disponible
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Baisse de prix</Label>
              <p className="text-sm text-muted-foreground">
                Être notifié des baisses de prix sur les pièces suivies
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications Push</CardTitle>
          <CardDescription>Gérez vos préférences de notifications push</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activité de la collection</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications sur l'activité de votre collection
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des rappels pour les pièces en attente de commande
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
