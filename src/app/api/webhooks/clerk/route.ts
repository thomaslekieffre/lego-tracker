import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // Récupérer le corps de la requête
    const payload = await req.json();
    const headersList = await headers();

    // Récupérer les headers Svix
    const svixId = headersList.get('svix-id') ?? '';
    const svixTimestamp = headersList.get('svix-timestamp') ?? '';
    const svixSignature = headersList.get('svix-signature') ?? '';

    // Si un des headers est manquant, retourner une erreur
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Headers manquants:', { svixId, svixTimestamp, svixSignature });
      return new Response('Headers Svix manquants', {
        status: 400,
      });
    }

    // Vérifier la signature du webhook
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET manquant');
      return new Response('Secret webhook manquant', {
        status: 500,
      });
    }

    // Vérifier la signature
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Erreur de vérification webhook:', err);
      return new Response('Signature invalide', {
        status: 400,
      });
    }

    const eventType = evt.type;
    const { id: clerkId } = evt.data;

    if (!clerkId) {
      console.error('ID Clerk manquant dans les données');
      return new Response('ID Clerk manquant', {
        status: 400,
      });
    }

    console.log(`Webhook reçu! Type: ${eventType}, ID: ${clerkId}`);

    const supabase = createServerSupabaseClient();

    if (eventType === 'user.created') {
      // Extraire les données de l'utilisateur depuis l'événement
      const { email_addresses, image_url } = evt.data;

      // Log détaillé des données reçues
      console.log('Données brutes du webhook:', JSON.stringify(evt.data, null, 2));
      console.log('Email addresses:', JSON.stringify(email_addresses, null, 2));

      // Générer un email temporaire unique
      const tempEmail = `temp-${clerkId}-${Date.now()}@lego-tracker.local`;
      console.log('Email temporaire généré:', tempEmail);

      // Tenter de récupérer un email valide
      let email = tempEmail;

      // Log de la vérification des emails
      if (email_addresses) {
        console.log("Nombre d'emails trouvés:", email_addresses.length);
        if (email_addresses.length > 0) {
          console.log('Premier email trouvé:', email_addresses[0]);
          const primaryEmail = email_addresses[0].email_address;
          console.log('Email primaire extrait:', primaryEmail);

          if (primaryEmail && typeof primaryEmail === 'string') {
            const trimmedEmail = primaryEmail.trim();
            console.log('Email après trim:', trimmedEmail);

            if (trimmedEmail !== '' && trimmedEmail !== 'EMPTY') {
              email = trimmedEmail;
              console.log('Email valide trouvé:', email);
            } else {
              console.log('Email invalide (vide ou EMPTY), utilisation du temporaire');
            }
          } else {
            console.log('Email primaire invalide:', primaryEmail);
          }
        } else {
          console.log('Aucun email trouvé dans la liste');
        }
      } else {
        console.log("Pas de liste d'emails reçue");
      }

      console.log('Email final qui sera utilisé:', email);

      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (existingUser) {
        console.log('Utilisateur déjà existant:', clerkId);
        return new Response('Utilisateur déjà existant', {
          status: 200,
        });
      }

      // Créer l'utilisateur dans Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: clerkId,
            email,
            avatar_url: image_url || null,
            subscription_tier: 'free',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Erreur création utilisateur:', insertError);
        console.error("Détails de l'erreur:", {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
        });
      }

      console.log('Utilisateur créé avec succès:', {
        id: newUser.id,
        clerk_id: newUser.clerk_id,
        email: newUser.email,
      });

      return new Response(JSON.stringify({ success: true, userId: newUser.id }), {
        status: 201,
      });
    }

    // Pour les autres types d'événements
    return new Response('Événement ignoré', { status: 200 });
  } catch (error) {
    console.error('Erreur générale webhook:', error);
    return new Response(
      JSON.stringify({
        error: 'Erreur interne',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
      }
    );
  }
}
