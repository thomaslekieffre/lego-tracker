'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Box, Puzzle, Package, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentActivity, type RecentActivity as Activity } from '@/app/dashboard/actions';
import { useToast } from '@/components/ui/use-toast';

const ACTIVITY_ICONS = {
  set_status: <Box className="h-4 w-4" />,
  piece_status: <Puzzle className="h-4 w-4" />,
  set_added: <Package className="h-4 w-4" />,
  piece_added: <AlertCircle className="h-4 w-4" />,
};

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-4 p-4"
    >
      <div className="mt-1">{ACTIVITY_ICONS[activity.type]}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(activity.timestamp), {
            addSuffix: true,
            locale: fr,
          })}
        </p>
      </div>
    </motion.div>
  );
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getRecentActivity();
        setActivities(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de charger l'activité récente",
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadActivities();
  }, [toast]);

  if (isLoading) {
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

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">Aucune activité récente</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </CardContent>
    </Card>
  );
}
