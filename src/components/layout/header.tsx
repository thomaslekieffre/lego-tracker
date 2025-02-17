'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Blocks } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Ma Collection', href: '/collection' },
];

const MotionLink = motion(Link);

export function Header(): React.ReactElement {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90"
              >
                <Blocks className="h-6 w-6" />
                Lego Tracker
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <MotionLink
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                      transition={{ type: 'spring', bounce: 0.25 }}
                    />
                  )}
                </MotionLink>
              ))}
            </nav>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
