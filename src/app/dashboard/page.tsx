import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { StatsOverview } from '@/components/dashboard/stats/stats-overview';
import { RecentActivity } from '@/components/dashboard/activity/recent-activity';
import { QuickActions } from '@/components/dashboard/actions/quick-actions';
import { CollectionDistribution } from '@/components/dashboard/charts/collection-distribution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Dashboard | Lego Tracker',
  description: "Vue d'ensemble de votre collection Lego",
};

function LoadingStats() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function LoadingDistribution() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribution des Sets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-muted border-t-primary animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-4 p-4">
            <div className="h-4 w-4 mt-1 rounded bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre collection</p>
        </div>
        <QuickActions />
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Suspense fallback={<LoadingStats />}>
          <StatsOverview />
        </Suspense>
      </div>

      {/* Graphiques et activité récente */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">
        {/* Distribution de la collection */}
        <div className="md:col-span-2 lg:row-span-2 h-full">
          <Suspense fallback={<LoadingDistribution />}>
            <CollectionDistribution />
          </Suspense>
        </div>

        {/* Activité récente */}
        <div>
          <Suspense fallback={<LoadingActivity />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
