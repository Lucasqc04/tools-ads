import Image from 'next/image';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/lib/site-config';

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  size?: number;
  showName?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  size = 40,
  showName = false,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Image
        src="/favicon-96x96.png"
        alt={siteConfig.siteName}
        width={size}
        height={size}
        className={cn('h-10 w-10 object-contain', imageClassName)}
        priority={priority}
      />
      {showName ? (
        <span className="text-base font-bold tracking-tight text-slate-900">
          {siteConfig.siteName}
        </span>
      ) : (
        <span className="sr-only">{siteConfig.siteName}</span>
      )}
    </span>
  );
}
