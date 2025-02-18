import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserLegoSets } from '@/services/lego-sets';
import { CollectionContent } from './collection-content';

export default async function CollectionPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const sets = await getUserLegoSets();

  return <CollectionContent initialSets={sets} />;
}
