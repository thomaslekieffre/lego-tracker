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

interface LegoSetCardProps {
  id: string;
  name: string;
  setNumber: string;
  piecesCount: number;
  imageUrl?: string | null;
  status: 'mounted' | 'dismounted' | 'incomplete';
  missingPiecesCount: number;
}

export function LegoSetCard({
  id,
  name,
  setNumber,
  piecesCount,
  imageUrl,
  status,
  missingPiecesCount,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          <CardDescription className="mt-2 flex items-center justify-between">
            <span>{setNumber}</span>
            <span className={statusColor[status]}>{statusText[status]}</span>
          </CardDescription>
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
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full">
            <Link href={`/collection/${id}`}>Voir les détails</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
