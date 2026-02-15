import type { InputHTMLAttributes } from 'react';
import { useRef } from 'react';
import './radio.css';

export type RadioSize = 'sm' | 'md';
export type RadioState = 'default' | 'error';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  size?: RadioSize;
  state?: RadioState;
};

export function Radio({
  size = 'md',
  state = 'default',
  className,
  children,
  disabled,
  onClick,
  onKeyDown,
  ...rest
}: RadioProps) {
  const wasCheckedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown: RadioProps['onKeyDown'] = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') {
      wasCheckedRef.current = event.currentTarget.checked;
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const handleClick: RadioProps['onClick'] = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (disabled) return;
    const input = event.currentTarget;
    if (wasCheckedRef.current) {
      // Allow radios to be toggled off when clicking the checked item.
      input.checked = false;
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
    wasCheckedRef.current = false;
  };

  const handleMouseDown: RadioProps['onMouseDown'] = (event) => {
    wasCheckedRef.current = event.currentTarget.checked;
    rest.onMouseDown?.(event);
  };

  return (
    <label
      className={['pds-radio', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={state}
      data-disabled={disabled ? 'true' : 'false'}
      onMouseDown={() => {
        wasCheckedRef.current = inputRef.current?.checked ?? false;
      }}
    >
      <input
        {...rest}
        type="radio"
        className="pds-radio__input"
        disabled={disabled}
        ref={inputRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
      <span className="pds-radio__tap-target" aria-hidden="true">
        <span className="pds-radio__halo">
          <span className="pds-radio__control" />
        </span>
      </span>
      {children && <span className="pds-radio__label">{children}</span>}
    </label>
  );
}
