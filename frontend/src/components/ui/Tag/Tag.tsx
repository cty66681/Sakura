import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

export default function Tag({
  children,
  active = false,
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active
          ? 'border-blue-200 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:text-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}