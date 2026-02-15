import type { InputHTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import './checkbox.css';

export type CheckboxSize = 'sm' | 'md';

export type CheckboxType = 'default' | 'error';
export type CheckboxState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  size?: CheckboxSize;
  type?: CheckboxType;
  state?: CheckboxState;
  indeterminate?: boolean;
};

export function Checkbox({
  size = 'md',
  type = 'default',
  state = 'default',
  indeterminate = false,
  className,
  children,
  disabled,
  onKeyDown,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown: CheckboxProps['onKeyDown'] = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const resolvedDisabled = disabled || state === 'disabled';

  return (
    <label
      className={['pds-checkbox', className].filter(Boolean).join(' ')}
      data-size={size}
      data-type={type}
      data-state={state}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
    >
      <input
        {...rest}
        ref={inputRef}
        type="checkbox"
        className="pds-checkbox__input"
        disabled={resolvedDisabled}
        onKeyDown={handleKeyDown}
      />
      <span className="pds-checkbox__tap-target" aria-hidden="true">
        <span className="pds-checkbox__halo">
          <span className="pds-checkbox__control" />
        </span>
      </span>
      {children && <span className="pds-checkbox__label">{children}</span>}
    </label>
  );
}
