'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Boxes, Puzzle } from 'lucide-react';
import { LegoSetStatus } from '@/types/database';
import { ShareCollectionModal } from '@/components/share-collection-modal';

interface LegoSetCardProps {
  id: string;
  name: string;
  setNumber: string;
  piecesCount: number;
  imageUrl?: string | null;
  status: LegoSetStatus;
  missingPiecesCount: number;
  isSharedView?: boolean;
  isCompact?: boolean;
}

export function LegoSetCard({
  id,
  name,
  setNumber,
  piecesCount,
  imageUrl,
  status,
  missingPiecesCount,
  isSharedView = false,
  isCompact = false,
}: LegoSetCardProps): React.ReactElement {
  const statusColor = {
    mounted: 'text-green-500',
    dismounted: 'text-yellow-500',
    incomplete: 'text-red-500',
  };

  const statusText = {
    mounted: 'Monté',
    dismounted: 'Démonté',
    incomplete: 'Incomplet',
  };

  const imageSrc = imageUrl && imageUrl.length > 0 ? imageUrl : '/placeholder-set.jpg';

  const content = (
    <Card className={`overflow-hidden ${isCompact ? 'h-full' : ''}`}>
      <CardHeader className="p-0">
        <div className={`relative ${isCompact ? 'aspect-square' : 'aspect-[4/3]'} w-full`}>
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className={`${isCompact ? 'p-2' : 'p-4'}`}>
        <CardTitle className={`line-clamp-1 ${isCompact ? 'text-sm' : ''}`}>{name}</CardTitle>
        <CardDescription className="mt-2 flex items-center justify-between">
          <span>{setNumber}</span>
          <span className={statusColor[status]}>{statusText[status]}</span>
        </CardDescription>
        {!isCompact && (
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Boxes className="h-4 w-4" />
              <span>{piecesCount} pièces</span>
            </div>
            {missingPiecesCount > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <Puzzle className="h-4 w-4" />
                <span>
                  {missingPiecesCount} manquante{missingPiecesCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!isSharedView && !isCompact && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="secondary" className="flex-1">
            Voir les détails
          </Button>
          <ShareCollectionModal />
        </CardFooter>
      )}
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {isSharedView ? (
        <div className="group relative overflow-hidden h-full">{content}</div>
      ) : (
        <Link href={`/collection/${id}`} className="block group relative overflow-hidden h-full">
          {content}
        </Link>
      )}
    </motion.div>
  );
}
