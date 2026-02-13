import type { InputHTMLAttributes } from 'react';
import './toggle.css';

export type ToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ToggleType = 'regular' | 'text' | 'icon';
export type ToggleState = 'default' | 'hover' | 'focus' | 'disabled';

export type ToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'disabled'
> & {
  size?: ToggleSize;
  type?: ToggleType;
  state?: ToggleState;
};

function ToggleOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M11.9999 13.866L9.72165 16.1303C9.47232 16.3794 9.16599 16.5064 8.80265 16.5113C8.43915 16.5159 8.12807 16.3889 7.86941 16.1303C7.62024 15.8809 7.49565 15.5722 7.49565 15.204C7.49565 14.836 7.62024 14.5273 7.86941 14.278L10.1337 11.9998L7.86941 9.74651C7.62024 9.49717 7.49324 9.19084 7.48841 8.82751C7.48374 8.46401 7.61074 8.15292 7.86941 7.89426C8.11874 7.64509 8.42749 7.52051 8.79565 7.52051C9.16365 7.52051 9.47232 7.64509 9.72165 7.89426L11.9999 10.1585L14.2532 7.89426C14.5025 7.64509 14.8112 7.52051 15.1792 7.52051C15.5473 7.52051 15.8561 7.64509 16.1054 7.89426C16.3619 8.15076 16.4902 8.46126 16.4902 8.82576C16.4902 9.19026 16.3619 9.49717 16.1054 9.74651L13.8412 11.9998L16.1054 14.278C16.3546 14.5273 16.4792 14.836 16.4792 15.204C16.4792 15.5722 16.3546 15.8809 16.1054 16.1303C15.8489 16.3868 15.5384 16.515 15.1739 16.515C14.8094 16.515 14.5025 16.3868 14.2532 16.1303L11.9999 13.866Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function ToggleOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9.9995 13.1338L15.6735 7.45978C15.9322 7.20111 16.2408 7.07178 16.5995 7.07178C16.9582 7.07178 17.2668 7.20111 17.5255 7.45978C17.7843 7.71844 17.9137 8.02953 17.9137 8.39303C17.9137 8.75636 17.7843 9.06736 17.5255 9.32603L10.9397 15.926C10.6737 16.192 10.3603 16.325 9.9995 16.325C9.63867 16.325 9.32525 16.192 9.05925 15.926L6.45925 13.326C6.20058 13.0674 6.07358 12.7564 6.07825 12.393C6.08292 12.0295 6.21467 11.7184 6.4735 11.4598C6.73217 11.2011 7.04317 11.0718 7.4065 11.0718C7.77 11.0718 8.08108 11.2011 8.33975 11.4598L9.9995 13.1338Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function Toggle({
  size = 'md',
  type = 'regular',
  state = 'default',
  className,
  onKeyDown,
  ...rest
}: ToggleProps) {
  const resolvedDisabled = state === 'disabled';
  const isControlled = rest.checked !== undefined;
  const resolvedDefaultChecked = isControlled ? undefined : rest.defaultChecked;

  const handleKeyDown: ToggleProps['onKeyDown'] = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <label
      className={['pds-toggle', className].filter(Boolean).join(' ')}
      data-size={size}
      data-type={type}
      data-state={state}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
    >
      <input
        {...rest}
        type="checkbox"
        role="switch"
        className="pds-toggle__input"
        disabled={resolvedDisabled}
        checked={isControlled ? rest.checked : undefined}
        defaultChecked={resolvedDefaultChecked}
        onKeyDown={handleKeyDown}
      />
      <span className="pds-toggle__track" aria-hidden="true">
        {type === 'text' && (
          <>
            <span className="pds-toggle__text pds-toggle__text--on">ON</span>
            <span className="pds-toggle__text pds-toggle__text--off">OFF</span>
          </>
        )}
        <span className="pds-toggle__thumb">
          {type === 'icon' && (
            <>
              <span className="pds-toggle__icon pds-toggle__icon--off" aria-hidden="true">
                <ToggleOffIcon />
              </span>
              <span className="pds-toggle__icon pds-toggle__icon--on" aria-hidden="true">
                <ToggleOnIcon />
              </span>
            </>
          )}
        </span>
      </span>
    </label>
  );
}
