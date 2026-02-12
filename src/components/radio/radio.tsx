import type { InputHTMLAttributes } from 'react';
import './radio.css';

export type RadioSize = 'sm' | 'md';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  size?: RadioSize;
};

export function Radio({
  size = 'md',
  className,
  children,
  disabled,
  onKeyDown,
  ...rest
}: RadioProps) {
  const handleKeyDown: RadioProps['onKeyDown'] = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <label
      className={['pds-radio', className].filter(Boolean).join(' ')}
      data-size={size}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <input
        {...rest}
        type="radio"
        className="pds-radio__input"
        disabled={disabled}
        onKeyDown={handleKeyDown}
      />
      <span className="pds-radio__control" aria-hidden="true" />
      {children && <span className="pds-radio__label">{children}</span>}
    </label>
  );
}
