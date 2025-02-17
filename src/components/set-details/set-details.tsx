'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Box, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LegoSet } from '@/schemas/database';
import { SetStatus } from './set-status';
import { SetNotes } from './set-notes';
import { MissingPieces } from './missing-pieces';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type SetDetailsProps = {
  set: LegoSet;
};

export function SetDetails({ set }: SetDetailsProps) {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Navigation */}
      <motion.div variants={fadeIn}>
        <Button variant="ghost" asChild className="pl-0 group">
          <Link href="/collection" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Retour à la collection
          </Link>
        </Button>
      </motion.div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Image Section */}
        <motion.div variants={fadeIn}>
          <Card className="p-4 relative aspect-square overflow-hidden group">
            <Image
              src={set.image_url ?? '/placeholder-set.jpg'}
              alt={set.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Card>
        </motion.div>

        {/* Details Section */}
        <div className="space-y-6">
          <motion.div variants={fadeIn} className="space-y-2">
            <h1 className="text-2xl font-bold">{set.name}</h1>
            <p className="text-muted-foreground">
              Set #{set.set_number} • {set.pieces_count} pièces • {set.year}
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-4">
            <SetStatus set={set} />
            <SetNotes set={set} />
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
            <MissingPieces set={set} />
            <Button variant="outline" asChild className="flex items-center gap-2 transition-colors">
              <a
                href={`https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set.set_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Voir sur Bricklink
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
