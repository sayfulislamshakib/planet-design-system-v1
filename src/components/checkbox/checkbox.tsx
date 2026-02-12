import type { InputHTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import './checkbox.css';

export type CheckboxSize = 'sm' | 'md';

export type CheckboxState = 'default' | 'error';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  size?: CheckboxSize;
  state?: CheckboxState;
  indeterminate?: boolean;
};

export function Checkbox({
  size = 'md',
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

  return (
    <label
      className={['pds-checkbox', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={state}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <input
        {...rest}
        ref={inputRef}
        type="checkbox"
        className="pds-checkbox__input"
        disabled={disabled}
        onKeyDown={handleKeyDown}
      />
      <span className="pds-checkbox__halo" aria-hidden="true">
        <span className="pds-checkbox__control" />
      </span>
      {children && <span className="pds-checkbox__label">{children}</span>}
    </label>
  );
}
