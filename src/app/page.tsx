'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  'Gestion illimitée de sets Lego',
  'Suivi des pièces manquantes',
  'Statistiques détaillées',
  'Partage de collections',
  'Export de données',
  'Synchronisation avec Rebrickable',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const floatingAnimation = {
  y: [-10, 10],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export default function Home(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative isolate">
          {/* Gradient */}
          <div
            className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#9089fc]">
                  Gérez votre collection Lego comme un pro
                </h1>
              </motion.div>

              <motion.p
                className="mt-6 text-lg leading-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Organisez, suivez et optimisez votre collection de Lego. Ne perdez plus jamais une
                pièce et profitez pleinement de votre passion.
              </motion.p>

              <motion.div
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button asChild size="lg" className="gap-2">
                  <Link href="/sign-up">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Image flottante */}
              <motion.div
                className="mt-16 relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  delay: 0.6,
                }}
              >
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Cercle décoratif */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-[#9089fc] rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />

                  {/* Container de l'image avec effet de profondeur */}
                  <motion.div className="relative" animate={floatingAnimation}>
                    <div className="absolute -inset-px bg-gradient-to-r from-primary to-[#9089fc] rounded-lg" />
                    <div className="relative bg-background rounded-lg p-1">
                      <Image
                        src="https://images.unsplash.com/photo-1562331769-82a47d603c57?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Collection de Lego colorés"
                        width={800}
                        height={600}
                        className="rounded-lg shadow-2xl w-full h-auto transform transition-transform duration-500 hover:scale-[1.02]"
                        priority
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce qu'il vous faut
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Une suite complète d'outils pour gérer votre collection Lego de manière
              professionnelle.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div key={feature} className="flex gap-x-3" variants={itemVariants}>
                  <CheckCircle2 className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  <span className="text-sm leading-6">{feature}</span>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Lego Tracker. Tous droits réservés.
            </p>
            <div className="flex gap-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
