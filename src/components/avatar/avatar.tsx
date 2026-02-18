import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import './avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded';
export type AvatarState = 'default' | 'disabled';
export type AvatarVariant = 'default' | 'image';
export type AvatarColor = 'auto' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green' | 'magenta' | 'gray';
export type AvatarImageSource = ImgHTMLAttributes<HTMLImageElement>['src'] | Blob;
type AvatarInlineStyle = CSSProperties & {
  '--pds-avatar-auto-bg'?: string;
  '--pds-avatar-auto-text'?: string;
  '--pds-avatar-auto-border'?: string;
};

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  size?: AvatarSize;
  shape?: AvatarShape;
  state?: AvatarState;
  variant?: AvatarVariant;
  src?: AvatarImageSource;
  alt?: ImgHTMLAttributes<HTMLImageElement>['alt'];
  name?: string;
  initials?: string;
  fallback?: ReactNode;
  color?: AvatarColor;
};

const AVATAR_COLOR_MAP = {
  blue: '#2F80FF',
  red: '#F40B3A',
  yellow: '#F6BE4B',
  purple: '#8A44E3',
  orange: '#E06B05',
  green: '#08A35A',
  magenta: '#C12AA5',
  gray: '#8B8B8B',
} as const;

const AVATAR_COLOR_PALETTE = Object.values(AVATAR_COLOR_MAP);

function deriveLetter(name?: string): string {
  if (!name) {
    return '';
  }

  const value = name.trim();
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase();
}

function normalizeLetter(initials?: string): string {
  if (!initials) {
    return '';
  }

  return initials
    .trim()
    .replace(/\s+/g, '')
    .slice(0, 1)
    .toUpperCase();
}

function normalizeHex(value: string): string | null {
  const hex = value.trim().replace('#', '');
  if (/^[\da-fA-F]{6}$/.test(hex)) {
    return `#${hex.toUpperCase()}`;
  }

  if (/^[\da-fA-F]{3}$/.test(hex)) {
    return `#${hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toUpperCase()}`;
  }

  return null;
}

function hexToRgb(value: string): [number, number, number] | null {
  const normalized = normalizeHex(value);
  if (!normalized) {
    return null;
  }

  const hex = normalized.slice(1);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return [red, green, blue];
}

function toLuminanceChannel(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) {
    return 0;
  }

  const [red, green, blue] = rgb;
  return (
    0.2126 * toLuminanceChannel(red) +
    0.7152 * toLuminanceChannel(green) +
    0.0722 * toLuminanceChannel(blue)
  );
}

function getContrastRatio(first: string, second: string): number {
  const luminanceA = getLuminance(first);
  const luminanceB = getLuminance(second);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableTextColor(background: string): string {
  const light = '#FFFFFF';
  const dark = '#000000';
  const lightRatio = getContrastRatio(background, light);
  const darkRatio = getContrastRatio(background, dark);

  // Bias toward white so avatar letters keep a lighter visual style.
  // Switch to dark only when it is much more readable.
  const whitePreferenceMultiplier = 7;
  if (lightRatio * whitePreferenceMultiplier >= darkRatio) {
    return light;
  }

  return dark;
}

function getPaletteIndex(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash % AVATAR_COLOR_PALETTE.length;
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  state = 'default',
  variant = 'default',
  src,
  alt,
  name,
  initials,
  fallback,
  color = 'auto',
  className,
  style,
  ...rest
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<AvatarProps['src']>();
  const resolvedSrc = useMemo(() => {
    if (!src) {
      return undefined;
    }

    if (typeof src === 'string') {
      return src;
    }

    return URL.createObjectURL(src);
  }, [src]);

  useEffect(() => {
    if (!resolvedSrc || typeof src === 'string') {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(resolvedSrc);
    };
  }, [resolvedSrc, src]);

  const resolvedLetter = useMemo(() => {
    const fromInitials = normalizeLetter(initials);
    if (fromInitials) {
      return fromInitials;
    }
    return deriveLetter(name);
  }, [initials, name]);

  const resolvedAutoColorKey = useMemo(() => {
    const fallbackText = typeof fallback === 'string' ? fallback : '';
    const srcSeed = typeof src === 'string' ? src : '';
    const candidate = (name ?? initials ?? fallbackText ?? srcSeed ?? '').trim();
    return candidate || 'avatar';
  }, [fallback, initials, name, src]);

  const avatarBackground = useMemo(() => {
    if (color !== 'auto') {
      return AVATAR_COLOR_MAP[color];
    }

    const paletteIndex = getPaletteIndex(resolvedAutoColorKey);
    return AVATAR_COLOR_PALETTE[paletteIndex];
  }, [color, resolvedAutoColorKey]);

  const avatarTextColor = useMemo(() => getReadableTextColor(avatarBackground), [avatarBackground]);

  const resolvedStyle = useMemo<AvatarInlineStyle>(
    () => ({
      ...(style as CSSProperties),
      '--pds-avatar-auto-bg': avatarBackground,
      '--pds-avatar-auto-text': avatarTextColor,
      '--pds-avatar-auto-border': avatarBackground,
    }),
    [avatarBackground, avatarTextColor, style],
  );

  const hasImage = variant === 'image' && Boolean(resolvedSrc) && src !== failedSrc;
  const explicitAriaLabel = typeof rest['aria-label'] === 'string' ? rest['aria-label'] : undefined;
  const fallbackAriaLabel = explicitAriaLabel ?? name ?? (resolvedLetter ? `Avatar ${resolvedLetter}` : 'Avatar');

  return (
    <span
      {...rest}
      className={['pds-avatar', className].filter(Boolean).join(' ')}
      style={resolvedStyle}
      data-size={size}
      data-shape={shape}
      data-state={state}
      data-variant={variant}
      data-has-image={hasImage ? 'true' : 'false'}
      role={hasImage ? undefined : 'img'}
      aria-label={hasImage ? undefined : fallbackAriaLabel}
    >
      {hasImage && (
        <img
          className="pds-avatar__image"
          src={resolvedSrc}
          alt={alt ?? name ?? 'Avatar'}
          onError={() => setFailedSrc(src)}
        />
      )}

      {!hasImage && fallback && (
        <span className="pds-avatar__fallback" aria-hidden="true">
          {fallback}
        </span>
      )}

      {!hasImage && !fallback && resolvedLetter && (
        <span className="pds-avatar__fallback" aria-hidden="true">
          {resolvedLetter}
        </span>
      )}
    </span>
  );
}
