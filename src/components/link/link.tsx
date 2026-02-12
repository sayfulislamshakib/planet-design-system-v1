import type { AnchorHTMLAttributes, ComponentType } from 'react';
import type { IconBaseProps } from '@justgo/planet-icons';
import * as PlanetIcons from '@justgo/planet-icons';
import { IconCloseStyleOutline } from '@justgo/planet-icons';
import './link.css';

export type LinkType =
  | 'regular'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'warning'
  | 'error'
  | 'visited'
  | 'inverse';

export type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LinkState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> & {
  type?: LinkType;
  size?: LinkSize;
  state?: LinkState;
  underline?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftIconName?: string;
  rightIconName?: string;
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick'] | Record<string, never>;
};

export function Link({
  type = 'regular',
  size = 'md',
  state = 'default',
  underline = false,
  leftIcon = false,
  rightIcon = false,
  leftIconName,
  rightIconName,
  className,
  onClick,
  children,
  href,
  target,
  rel,
  tabIndex,
  ...rest
}: LinkProps) {
  const resolvedOnClick = typeof onClick === 'function' ? onClick : undefined;
  const resolvedDisabled = state === 'disabled';
  const resolvedHref = resolvedDisabled ? undefined : href;
  const resolvedTabIndex = resolvedDisabled ? -1 : tabIndex;
  const resolvedRel = target === '_blank' && !rel ? 'noreferrer noopener' : rel;

  const resolveIconComponent = (iconName?: string): ComponentType<IconBaseProps> => {
    const fallbackName = 'IconChevronRightStyleOutline';
    const candidateName = iconName ?? fallbackName;
    const candidate = (PlanetIcons as Record<string, ComponentType<IconBaseProps>>)[candidateName];
    return typeof candidate === 'function' ? candidate : IconCloseStyleOutline;
  };

  const LeftIconComponent = resolveIconComponent(leftIconName);
  const RightIconComponent = resolveIconComponent(rightIconName);

  return (
    <a
      {...rest}
      href={resolvedHref}
      target={target}
      rel={resolvedRel}
      onClick={resolvedOnClick}
      tabIndex={resolvedTabIndex}
      aria-disabled={resolvedDisabled ? 'true' : undefined}
      className={['pds-link', className].filter(Boolean).join(' ')}
      data-variant={type}
      data-size={size}
      data-state={state}
      data-underline={underline ? 'true' : 'false'}
    >
      {leftIcon && (
        <span className="pds-link__icon" aria-hidden="true">
          <LeftIconComponent size="md" />
        </span>
      )}
      <span className="pds-link__label">
        {children}
        <span className="pds-link__underline" aria-hidden="true" />
      </span>
      {rightIcon && (
        <span className="pds-link__icon" aria-hidden="true">
          <RightIconComponent size="md" />
        </span>
      )}
    </a>
  );
}
