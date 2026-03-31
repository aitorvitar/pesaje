'use client';

import Image from 'next/image';
import { CompositionType } from '@/lib/types';
import { getCompositionLabel, getCompositionColor, getBodyImage } from '@/lib/composition';

interface BodyAvatarProps {
  type: CompositionType;
  bmi: number;
  size?: 'sm' | 'md' | 'lg';
}

export function BodyAvatar({ type, bmi, size = 'md' }: BodyAvatarProps) {
  const label = getCompositionLabel(type);
  const color = getCompositionColor(type);
  const bodyImage = getBodyImage(bmi);

  const sizeMap = {
    sm: { container: 'w-24 h-32', image: 'w-24 h-32' },
    md: { container: 'w-32 h-40', image: 'w-32 h-40' },
    lg: { container: 'w-48 h-56', image: 'w-48 h-56' },
  };

  const sizes = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes.container} relative mx-auto flex items-center justify-center bg-muted rounded-lg overflow-hidden`}>
        <Image
          src={bodyImage}
          alt={`Body type: ${label}`}
          width={200}
          height={240}
          className={`${sizes.image} object-cover`}
          priority
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">Estado</p>
        <p className="text-lg font-bold" style={{ color }}>
          {label}
        </p>
      </div>
    </div>
  );
}
