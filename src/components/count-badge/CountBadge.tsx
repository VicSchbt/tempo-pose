import { Badge } from '@/components/ui/badge';

type CountBadgeProps = {
  count: number;
  ariaLabel?: string;
  title?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
};

export function CountBadge({
  count,
  ariaLabel = `Count: ${count}`,
  title,
  variant = 'secondary',
  className,
}: CountBadgeProps) {
  if (count <= 0) return null;
  return (
    <Badge variant={variant} aria-label={ariaLabel} title={title} className={className}>
      {count}
    </Badge>
  );
}
