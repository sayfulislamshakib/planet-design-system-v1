import type { HTMLAttributes } from 'react';
import './overlay.css';

export type OverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  inverse?: boolean;
  blur?: boolean;
};

export function Overlay({
  inverse = false,
  blur = false,
  className,
  ...rest
}: OverlayProps) {
  return (
    <div
      {...rest}
      className={['pds-overlay', className].filter(Boolean).join(' ')}
      data-inverse={inverse ? 'true' : 'false'}
      data-blur={blur ? 'true' : 'false'}
    />
  );
}
