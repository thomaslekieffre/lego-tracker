'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps
  extends Omit<HTMLMotionProps<'div'>, 'animate' | 'initial' | 'exit' | 'transition'> {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedContainerProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
