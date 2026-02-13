import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
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
  placeholder = 'Placeholder text',
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? `pds-input-${generatedId}`;
  const resolvedDisabled = disabled || state === 'disable';
  const hasHelperText = showHelperText && Boolean(helperText);
  const forceHover = !resolvedDisabled && hover;
  const forceFocus = !resolvedDisabled && focus;
  const resolvedAriaInvalid = ariaInvalid ?? (type === 'error' ? true : undefined);

  return (
    <div
      className={['pds-input', className].filter(Boolean).join(' ')}
      data-size={size}
      data-type={type}
      data-state={state}
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
          <div className="pds-input__control">
            {leftIcon && (
              <span className="pds-input__icon pds-input__icon--left" aria-hidden="true">
                <IconSearch size="md" />
              </span>
            )}

            {startAdornment && <span className="pds-input__adornment">{startAdornment}</span>}

            <input
              {...rest}
              id={fieldId}
              type={inputType}
              className="pds-input__field"
              required={required}
              disabled={resolvedDisabled}
              placeholder={placeholder}
              aria-invalid={resolvedAriaInvalid}
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
