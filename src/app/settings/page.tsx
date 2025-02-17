import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountSettings } from '@/components/settings/account-settings';
import { DisplaySettings } from '@/components/settings/display-settings';
import { ExportSettings } from '@/components/settings/export-settings';

export const metadata: Metadata = {
  title: 'Paramètres | Lego Tracker',
  description: 'Gérez vos préférences et paramètres de compte',
};

export default function SettingsPage() {
  const { userId } = auth();

  if (!userId) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
        </div>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
          </TabsContent>
          <TabsContent value="display" className="space-y-4">
            <DisplaySettings />
          </TabsContent>
          <TabsContent value="export" className="space-y-4">
            <ExportSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
