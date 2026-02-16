import type { ChangeEventHandler, InputHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import { IconInfoStyleOutline, IconSearch } from '@justgo/planet-icons';
import './input.css';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputType = 'regular' | 'success' | 'error';
export type InputState = 'default' | 'filled' | 'disable';
export type InputLabelPosition = 'top' | 'left';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  size?: InputSize;
  type?: InputType;
  state?: InputState;
  hover?: boolean;
  focus?: boolean;
  label?: boolean;
  labelText?: string;
  labelIcon?: boolean;
  labelPosition?: InputLabelPosition;
  showHelperText?: boolean;
  helperText?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  inputType?: InputHTMLAttributes<HTMLInputElement>['type'];
};

function hasFieldValue(
  candidate: InputHTMLAttributes<HTMLInputElement>['value'] | InputHTMLAttributes<HTMLInputElement>['defaultValue'],
): boolean {
  if (candidate === undefined || candidate === null) {
    return false;
  }

  if (Array.isArray(candidate)) {
    return candidate.length > 0;
  }

  return String(candidate).length > 0;
}

export function Input({
  size = 'md',
  type = 'regular',
  state = 'default',
  hover = false,
  focus = false,
  label = true,
  labelText = 'Label',
  labelIcon = false,
  labelPosition = 'top',
  showHelperText = false,
  helperText = 'Your helper text',
  leftIcon = false,
  rightIcon = false,
  startAdornment,
  endAdornment,
  inputType = 'text',
  className,
  id,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  placeholder = 'Placeholder text',
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = id ?? `pds-input-${generatedId}`;
  const isControlled = value !== undefined;
  const [uncontrolledFilled, setUncontrolledFilled] = useState(() => hasFieldValue(defaultValue));
  const isFilled = isControlled ? hasFieldValue(value) : uncontrolledFilled;
  const resolvedState: InputState = state === 'default' && isFilled ? 'filled' : state;
  const resolvedDisabled = disabled || state === 'disable';
  const hasHelperText = showHelperText && Boolean(helperText);
  const forceHover = !resolvedDisabled && hover;
  const forceFocus = !resolvedDisabled && focus;
  const resolvedAriaInvalid = ariaInvalid ?? (type === 'error' ? true : undefined);
  const focusableSelector = 'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

  const handleControlMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (resolvedDisabled) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement) {
      return;
    }

    if (target.closest(focusableSelector)) {
      return;
    }

    event.preventDefault();
    inputRef.current?.focus();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event);
    if (event.defaultPrevented || isControlled) {
      return;
    }

    setUncontrolledFilled(event.currentTarget.value.length > 0);
  };

  return (
    <div
      className={['pds-input', className].filter(Boolean).join(' ')}
      data-size={size}
      data-type={type}
      data-state={resolvedState}
      data-label-position={labelPosition}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-hover={forceHover ? 'true' : 'false'}
      data-focus={forceFocus ? 'true' : 'false'}
    >
      <div className="pds-input__layout">
        {label && (
          <label className="pds-input__label" htmlFor={fieldId}>
            <span>{labelText}</span>
            {required && <span className="pds-input__required">*</span>}
            {labelIcon && (
              <span className="pds-input__label-icon" aria-hidden="true">
                <IconInfoStyleOutline size="md" />
              </span>
            )}
          </label>
        )}

        <div className="pds-input__body">
          <div className="pds-input__control" onMouseDown={handleControlMouseDown}>
            {leftIcon && (
              <span className="pds-input__icon pds-input__icon--left" aria-hidden="true">
                <IconSearch size="md" />
              </span>
            )}

            {startAdornment && <span className="pds-input__adornment">{startAdornment}</span>}

            <input
              {...rest}
              id={fieldId}
              ref={inputRef}
              type={inputType}
              className="pds-input__field"
              value={value}
              defaultValue={defaultValue}
              required={required}
              disabled={resolvedDisabled}
              placeholder={placeholder}
              aria-invalid={resolvedAriaInvalid}
              onChange={handleInputChange}
            />

            {endAdornment && <span className="pds-input__adornment">{endAdornment}</span>}

            {rightIcon && (
              <span className="pds-input__icon pds-input__icon--right" aria-hidden="true">
                <IconSearch size="md" />
              </span>
            )}
          </div>

          {hasHelperText && <p className="pds-input__helper">{helperText}</p>}
        </div>
      </div>
    </div>
  );
}
