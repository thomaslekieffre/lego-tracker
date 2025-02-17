'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getSetDistribution, type SetDistribution } from '@/app/dashboard/actions';
import { useToast } from '@/components/ui/use-toast';

const COLORS = {
  mounted: '#22c55e', // vert
  dismounted: '#f97316', // orange
  incomplete: '#ef4444', // rouge
};

export function CollectionDistribution() {
  const [data, setData] = useState<SetDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDistribution() {
      try {
        const distribution = await getSetDistribution();
        setData(distribution);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la distribution des sets',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadDistribution();
  }, [toast]);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
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

  if (total === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Distribution des Sets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Aucun set dans votre collection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribution des Sets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status]} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SetDistribution;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <div
                              className="h-2 w-2 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[data.status] }}
                            />
                            <span className="font-medium">{data.label}</span>
                          </div>
                          <div className="text-right font-medium">{data.count} sets</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((data.count / total) * 100)}%
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4">
            {data.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.status] }}
                />
                <span className="text-sm">
                  {item.label} ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
