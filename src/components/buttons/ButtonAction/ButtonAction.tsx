import type { ButtonHTMLAttributes } from 'react';
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
};

export function ButtonAction({
  size = 'md',
  state = 'default',
  className,
  disabled,
  ...rest
}: ButtonActionProps) {
  const resolvedState = state === 'disable' ? 'disabled' : state;
  const resolvedDisabled = Boolean(disabled || resolvedState === 'disabled');
  const ariaLabel = rest['aria-label'] ?? 'More options';

  return (
    <button
      {...rest}
      type="button"
      disabled={resolvedDisabled}
      aria-label={ariaLabel}
      className={['pds-button-action', 'tap-target', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={resolvedState}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
    >
      <span className="pds-button-action__icon" aria-hidden="true">
        <IconDotsTypeVertical size={size} />
      </span>
    </button>
  );
}
