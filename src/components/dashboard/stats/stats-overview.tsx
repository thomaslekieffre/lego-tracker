'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Puzzle, Package, AlertCircle } from 'lucide-react';
import { getDashboardStats, type DashboardStats } from '@/app/dashboard/actions';
import { useToast } from '@/components/ui/use-toast';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    color: string;
  };
};

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-lg border bg-background p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {trend && (
          <p className="mt-2 text-xs" style={{ color: trend.color }}>
            {trend.value >= 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function StatsOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les statistiques',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [toast]);

  if (isLoading || !stats) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-lg border bg-background p-6 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </>
    );
  }

  const statItems = [
    {
      title: 'Sets Total',
      value: stats.totalSets.toString(),
      description: 'Sets dans votre collection',
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: 'Sets Montés',
      value: stats.mountedSets.toString(),
      description: 'Sets actuellement montés',
      icon: <Box className="h-4 w-4" />,
    },
    {
      title: 'Pièces Manquantes',
      value: stats.missingPieces.toString(),
      description: 'À travers tous vos sets',
      icon: <Puzzle className="h-4 w-4" />,
    },
    {
      title: 'Sets Incomplets',
      value: stats.incompleteSets.toString(),
      description: 'Sets nécessitant des pièces',
      icon: <AlertCircle className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </>
  );
}
