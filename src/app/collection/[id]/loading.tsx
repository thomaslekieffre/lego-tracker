import { SetDetailsSkeleton } from '@/components/set-details/loading';

export default function SetLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SetDetailsSkeleton />
    </main>
  );
}
