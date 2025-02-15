'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Boxes,
  Puzzle,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ma Collection', href: '/collection', icon: Boxes },
  { name: 'Pièces Manquantes', href: '/missing-pieces', icon: Puzzle },
  { name: 'Statistiques', href: '/stats', icon: BarChart3 },
];

const secondaryNavigation = [
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Aide', href: '/help', icon: HelpCircle },
];

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: '-100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export function Sidebar(): React.ReactElement {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }): React.ReactElement => (
    <>
      {/* Navigation principale */}
      <div className="space-y-1 pt-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              'group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-muted text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </div>

      {/* Navigation secondaire */}
      <div className="mt-10">
        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase">Configuration</p>
        <div className="mt-2 space-y-1">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              className={cn(
                'group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Bouton menu mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-3 z-50 lg:hidden"
        onClick={(): void => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Overlay mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={(): void => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r p-4 lg:hidden"
          >
            <nav className="flex flex-col h-full pt-16">
              <NavLinks onClick={(): void => setIsMobileMenuOpen(false)} />
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background lg:pt-16 lg:pb-4">
        <nav className="flex flex-col flex-1 px-4">
          <NavLinks />
        </nav>
      </aside>
    </>
  );
}
