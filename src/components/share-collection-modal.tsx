'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { useCollectionSharing } from '@/hooks/use-collection-sharing';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface ShareCollectionModalProps {
  className?: string;
}

export function ShareCollectionModal({ className }: ShareCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const { generateShareToken, isSharing, error } = useCollectionSharing({
    isPublic,
  });

  const handleShare = async () => {
    try {
      const shareToken = await generateShareToken();
      const url = `${window.location.origin}/shared/${shareToken}`;
      setShareUrl(url);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error || 'Erreur lors de la création du lien de partage',
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({
        title: 'Lien copié !',
        description: 'Le lien de partage a été copié dans le presse-papier.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de copier le lien',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager ma collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager ma collection</DialogTitle>
          <DialogDescription>
            Créez un lien de partage pour votre collection LEGO complète
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="public">Collection publique</Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isSharing}
            />
          </div>
          {shareUrl ? (
            <div className="flex space-x-2">
              <Input readOnly value={shareUrl} className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={isSharing}>
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button onClick={handleShare} disabled={isSharing} className="w-full">
              {isSharing ? 'Création du lien...' : 'Créer un lien de partage'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
