'use client';

import { CompositionType } from '@/lib/types';
import { getCompositionLabel, getCompositionColor, getAvatarShape } from '@/lib/composition';

interface BodyAvatarProps {
  type: CompositionType;
  size?: 'sm' | 'md' | 'lg';
}

export function BodyAvatar({ type, size = 'md' }: BodyAvatarProps) {
  const label = getCompositionLabel(type);
  const color = getCompositionColor(type);
  const transform = getAvatarShape(type);

  const sizeMap = {
    sm: { container: 'w-24 h-32', head: 'w-6 h-6', body: 'w-8 h-10', limbs: 'w-1 h-8' },
    md: { container: 'w-32 h-40', head: 'w-8 h-8', body: 'w-10 h-14', limbs: 'w-1.5 h-10' },
    lg: { container: 'w-48 h-56', head: 'w-12 h-12', body: 'w-14 h-20', limbs: 'w-2 h-14' },
  };

  const sizes = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes.container} relative mx-auto flex items-center justify-center`}>
        {/* Head */}
        <div
          className={`${sizes.head} rounded-full absolute top-0`}
          style={{
            backgroundColor: color,
            opacity: 0.9,
          }}
        />

        {/* Body */}
        <div
          className={`${sizes.body} rounded-full absolute top-1/3`}
          style={{
            backgroundColor: color,
            opacity: 0.8,
            transform: transform,
          }}
        />

        {/* Left Arm */}
        <div
          className={`${sizes.limbs} rounded-full absolute`}
          style={{
            backgroundColor: color,
            opacity: 0.7,
            left: '10%',
            top: '40%',
            transform: 'rotate(-30deg)',
          }}
        />

        {/* Right Arm */}
        <div
          className={`${sizes.limbs} rounded-full absolute`}
          style={{
            backgroundColor: color,
            opacity: 0.7,
            right: '10%',
            top: '40%',
            transform: 'rotate(30deg)',
          }}
        />

        {/* Left Leg */}
        <div
          className={`${sizes.limbs} rounded-full absolute`}
          style={{
            backgroundColor: color,
            opacity: 0.7,
            left: '35%',
            bottom: '0%',
          }}
        />

        {/* Right Leg */}
        <div
          className={`${sizes.limbs} rounded-full absolute`}
          style={{
            backgroundColor: color,
            opacity: 0.7,
            right: '35%',
            bottom: '0%',
          }}
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
