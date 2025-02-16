import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.href) {
          return (
            <span
              key={item.label}
              className={cn('flex items-center', isLast && 'text-foreground font-medium')}
            >
              {item.label}
            </span>
          );
        }

        return (
          <span key={item.label} className="flex items-center space-x-1">
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </span>
        );
      })}
    </nav>
  );
}
