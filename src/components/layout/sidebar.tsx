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
  Library,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Ma Collection',
    href: '/collection',
    icon: Library,
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Aide',
    href: '/help',
    icon: HelpCircle,
  },
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
            <div className="flex flex-col h-full pt-16">
              <ScrollArea className="flex-1">
                <div className="flex flex-1 flex-col gap-2 p-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.href}
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className={cn('w-full justify-start gap-2')}
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background lg:pt-16 lg:pb-4">
        <div className="flex flex-col flex-1 px-4">
          <ScrollArea className="flex-1">
            <div className="flex flex-1 flex-col gap-2 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start gap-2')}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
