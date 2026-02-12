import type { ButtonHTMLAttributes, ComponentType } from 'react';
import type { IconBaseProps } from '@justgo/planet-icons';
import * as PlanetIcons from '@justgo/planet-icons';
import { IconCloseStyleOutline } from '@justgo/planet-icons';
import './chip.css';

export type ChipType =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'complementary';

export type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ChipState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled'> & {
  type?: ChipType;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] | Record<string, never>;
  size?: ChipSize;
  state?: ChipState;
  outline?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftIconName?: string;
  rightIconName?: string;
  iconOnlyName?: string;
};

export function Chip({
  type = 'primary',
  size = 'md',
  state = 'default',
  outline = false,
  rounded = false,
  iconOnly = false,
  leftIcon = false,
  rightIcon = false,
  leftIconName,
  rightIconName,
  iconOnlyName,
  className,
  onClick,
  children,
  ...rest
}: ChipProps) {
  const resolvedLeftIcon = iconOnly ? true : leftIcon;
  const resolvedRightIcon = iconOnly ? false : rightIcon;
  const hasIcon = Boolean(resolvedLeftIcon || resolvedRightIcon);
  const isIconOnly = iconOnly ?? (!children && hasIcon);
  const resolvedType = 'button';
  const resolvedOnClick = typeof onClick === 'function' ? onClick : undefined;
  const resolvedDisabled = state === 'disabled';
  const ariaLabel =
    rest['aria-label'] ??
    (isIconOnly && typeof children === 'string' && !rest['aria-labelledby'] ? children : undefined);

  if (isIconOnly && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('Chip: icon-only chips should include an aria-label.');
  }

  const resolveIconComponent = (iconName?: string): ComponentType<IconBaseProps> => {
    if (!iconName) return IconCloseStyleOutline;
    const candidate = (PlanetIcons as Record<string, ComponentType<IconBaseProps>>)[iconName];
    return typeof candidate === 'function' ? candidate : IconCloseStyleOutline;
  };

  const iconOnlyIconName = iconOnlyName ?? rightIconName ?? leftIconName;
  const LeftIconComponent = resolveIconComponent(iconOnly ? iconOnlyIconName : leftIconName);
  const RightIconComponent = resolveIconComponent(rightIconName);

  return (
    <button
      {...rest}
      type={resolvedType}
      onClick={resolvedOnClick}
      disabled={resolvedDisabled}
      className={['pds-chip', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-variant={type}
      data-size={size}
      data-state={state}
      data-outline={outline ? 'true' : 'false'}
      data-rounded={rounded ? 'true' : 'false'}
      data-icon-only={isIconOnly ? 'true' : 'false'}
    >
      {resolvedLeftIcon && (
        <span className="pds-chip__icon">
          <LeftIconComponent size="md" />
        </span>
      )}
      {!isIconOnly && <span className="pds-chip__label">{children}</span>}
      {resolvedRightIcon && (
        <span className="pds-chip__icon">
          <RightIconComponent size="md" />
        </span>
      )}
    </button>
  );
}
