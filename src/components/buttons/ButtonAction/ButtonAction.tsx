import { createElement, type ButtonHTMLAttributes, type ComponentType } from 'react';
import type { IconBaseProps } from '@justgo/planet-icons';
import * as PlanetIcons from '@justgo/planet-icons';
import { IconDotsTypeVertical } from '@justgo/planet-icons';
import './ButtonAction.css';

export type ButtonActionSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonActionState =
  | 'default'
  | 'active'
  | 'hover'
  | 'focus'
  | 'pressed'
  | 'disabled'
  | 'disable';

export type ButtonActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  size?: ButtonActionSize;
  state?: ButtonActionState;
  iconName?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] | Record<string, never>;
};

export function ButtonAction({
  size = 'md',
  state = 'default',
  iconName = 'IconDotsTypeVertical',
  className,
  disabled,
  onClick,
  ...rest
}: ButtonActionProps) {
  const resolvedState = state === 'disable' ? 'disabled' : state;
  const resolvedDisabled = Boolean(disabled || resolvedState === 'disabled');
  const resolvedOnClick = typeof onClick === 'function' ? onClick : undefined;
  const ariaLabel = rest['aria-label'] ?? 'More options';
  const iconRegistry = PlanetIcons as Record<string, ComponentType<IconBaseProps>>;
  const ResolvedIcon = iconRegistry[iconName] ?? IconDotsTypeVertical;

  return (
    <button
      {...rest}
      type="button"
      disabled={resolvedDisabled}
      onClick={resolvedOnClick}
      aria-label={ariaLabel}
      className={['pds-button-action', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={resolvedState}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
    >
      <span className="pds-button-action__tap-target" aria-hidden="true">
        <span className="pds-button-action__halo">
          <span className="pds-button-action__icon">
            {createElement(ResolvedIcon, { size })}
          </span>
        </span>
      </span>
    </button>
  );
}
