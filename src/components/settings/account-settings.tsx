'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useSetPreferences } from '@/stores/set-preferences';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AccountSettings() {
  const { user } = useUser();
  const { defaultStatus, setDefaultStatus } = useSetPreferences();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles et vos préférences de compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Nom d'affichage</Label>
            <Input
              id="display-name"
              defaultValue={user?.username || ''}
              placeholder="Votre nom d'affichage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Gérez votre email dans les paramètres de votre compte Clerk
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences de Collection</CardTitle>
          <CardDescription>Personnalisez la façon dont vous gérez votre collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-status">Statut par défaut des nouveaux sets</Label>
            <Select value={defaultStatus} onValueChange={setDefaultStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un statut par défaut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mounted">Monté</SelectItem>
                <SelectItem value="dismounted">Démonté</SelectItem>
                <SelectItem value="incomplete">Incomplet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Ce statut sera appliqué automatiquement aux nouveaux sets ajoutés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
