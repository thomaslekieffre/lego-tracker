'use client';

import { useState } from 'react';
import { createShareToken } from '@/app/collection/actions';

interface UseCollectionSharingProps {
  isPublic?: boolean;
}

interface UseCollectionSharingReturn {
  generateShareToken: () => Promise<string>;
  isSharing: boolean;
  error: string | null;
}

export const useCollectionSharing = ({
  isPublic = false,
}: UseCollectionSharingProps): UseCollectionSharingReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateShareToken = async (): Promise<string> => {
    setIsSharing(true);
    setError(null);

    try {
      const shareToken = await createShareToken(isPublic);
      return shareToken;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la création du lien de partage';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    generateShareToken,
    isSharing,
    error,
  };
};
