import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function SetDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Image Section */}
        <Card className="p-4 relative aspect-square">
          <Skeleton className="absolute inset-4" />
        </Card>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="space-y-4 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="grid gap-1.5 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full max-w-[250px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
