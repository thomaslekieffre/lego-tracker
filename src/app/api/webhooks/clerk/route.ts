import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

type UserWebhookEvent = {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
  object: 'event';
  type: 'user.created' | 'user.updated' | 'user.deleted';
};

async function updateSupabaseUser(event: UserWebhookEvent): Promise<void> {
  const { id, email_addresses, first_name, last_name, image_url } = event.data;
  const email = email_addresses[0]?.email_address;

  if (!email) {
    console.error("Pas d'adresse email trouvée pour l'utilisateur:", id);
    return;
  }

  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      const { error: upsertError } = await supabaseAdmin.from('users').upsert({
        clerk_id: id,
        email,
        display_name: first_name ? `${first_name} ${last_name ?? ''}`.trim() : null,
        avatar_url: image_url,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) {
        console.error('Erreur lors de la mise à jour Supabase:', upsertError);
        throw upsertError;
      }
      break;

    case 'user.deleted':
      const { error: deleteError } = await supabaseAdmin.from('users').delete().eq('clerk_id', id);

      if (deleteError) {
        console.error('Erreur lors de la suppression Supabase:', deleteError);
        throw deleteError;
      }
      break;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Vérifier la présence du secret
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('CLERK_WEBHOOK_SECRET manquant');
    }

    // Récupérer les headers Svix
    const headersList = await headers();
    const svixHeaders = {
      'svix-id': headersList.get('svix-id') ?? '',
      'svix-timestamp': headersList.get('svix-timestamp') ?? '',
      'svix-signature': headersList.get('svix-signature') ?? '',
    };

    // Vérifier la présence des headers requis
    if (
      !svixHeaders['svix-id'] ||
      !svixHeaders['svix-timestamp'] ||
      !svixHeaders['svix-signature']
    ) {
      return new Response('Headers Svix manquants', {
        status: 400,
      });
    }

    // Récupérer et vérifier le corps de la requête
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Vérifier la signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: UserWebhookEvent;

    try {
      evt = wh.verify(body, svixHeaders) as UserWebhookEvent;
    } catch (err) {
      console.error('Erreur de vérification webhook:', err);
      return new Response('Signature invalide', {
        status: 400,
      });
    }

    await updateSupabaseUser(evt);
    return new Response('Webhook traité avec succès', { status: 200 });
  } catch (error) {
    console.error('Erreur de traitement webhook:', error);
    return new Response('Erreur de traitement', { status: 500 });
  }
}
