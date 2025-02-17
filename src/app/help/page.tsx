import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata = {
  title: 'Aide | Lego Tracker',
  description: "Centre d'aide et documentation pour Lego Tracker",
};

export default function HelpPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centre d'Aide</h1>
          <p className="text-muted-foreground">Trouvez de l'aide et des réponses à vos questions</p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList>
            <TabsTrigger value="getting-started">Démarrage</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenue sur Lego Tracker</CardTitle>
                <CardDescription>
                  Apprenez à utiliser Lego Tracker pour gérer votre collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Créez votre compte</h3>
                  <p className="text-sm text-muted-foreground">
                    Commencez par créer un compte pour accéder à toutes les fonctionnalités. Vous
                    pourrez ensuite personnaliser votre profil dans les paramètres.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">2. Ajoutez vos sets</h3>
                  <p className="text-sm text-muted-foreground">
                    Depuis la page "Ma Collection", cliquez sur "Ajouter un set" et entrez le numéro
                    du set. Vous pouvez aussi scanner le code-barres de la boîte.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">3. Suivez votre progression</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez le tableau de bord pour voir vos statistiques et suivre l'évolution de
                    votre collection au fil du temps.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gérer votre Collection</CardTitle>
                <CardDescription>
                  Tout ce que vous devez savoir pour gérer efficacement votre collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="status">
                    <AccordionTrigger>Les différents statuts</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong>Monté</strong> - Le set est complètement assemblé
                        </li>
                        <li>
                          <strong>Démonté</strong> - Le set est démonté et rangé
                        </li>
                        <li>
                          <strong>Incomplet</strong> - Il manque des pièces au set
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="missing">
                    <AccordionTrigger>Gérer les pièces manquantes</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Quand vous marquez un set comme incomplet, vous pouvez indiquer le nombre de
                        pièces manquantes. Cela vous aidera à suivre les pièces à commander.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="export">
                    <AccordionTrigger>Exporter vos données</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Vous pouvez exporter les données de votre collection depuis les paramètres.
                        L'export inclut vos statistiques et la liste complète de vos sets.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquentes</CardTitle>
                <CardDescription>Réponses aux questions les plus courantes</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="offline">
                    <AccordionTrigger>Puis-je utiliser l'application hors ligne ?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Malheuresement non, l'application n'est pas disponible hors ligne.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="privacy">
                    <AccordionTrigger>Mes données sont-elles sécurisées ?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Oui, nous utilisons Clerk pour l'authentification et Supabase pour le
                        stockage des données. Vos informations sont chiffrées et protégées selon les
                        standards de l'industrie.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="delete">
                    <AccordionTrigger>Comment supprimer mon compte ?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Vous pouvez supprimer votre compte depuis les paramètres. Cette action est
                        irréversible et supprimera toutes vos données.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
