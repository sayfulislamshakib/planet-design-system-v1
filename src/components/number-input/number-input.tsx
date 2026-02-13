import type {
  CSSProperties,
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
} from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { autoUpdate } from '@floating-ui/react-dom';
import { IconAdd, IconMenuPositionDown, IconRemove } from '@justgo/planet-icons';
import { createPortal } from 'react-dom';
import './number-input.css';

export type NumberInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type NumberInputState = 'active' | 'disable';
type ScrollDirection = -1 | 1;
type DropdownPositionStyle = CSSProperties & {
  '--number-input-bg'?: string;
  '--number-input-border'?: string;
  '--number-input-content'?: string;
  '--number-input-control-size'?: string;
  '--number-input-focus-ring'?: string;
  '--number-input-menu-selected-bg'?: string;
  '--number-input-menu-selected-border'?: string;
  '--number-input-menu-selected-content'?: string;
};

export type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
  size?: NumberInputSize;
  state?: NumberInputState;
  dropdownIcon?: boolean;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  dropdownOptions?: number[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: number) => void;
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
  onDropdownSelect?: (value: number) => void;
  onDropdownClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (typeof min === 'number') next = Math.max(min, next);
  if (typeof max === 'number') next = Math.min(max, next);
  return next;
}

function normalize(value: number, min?: number, max?: number): number {
  if (!Number.isFinite(value)) return clamp(0, min, max);
  return clamp(value, min, max);
}

function isDecimalStep(step: number): boolean {
  return Math.floor(step) !== step;
}

function roundValue(value: number): number {
  return Number(value.toFixed(6));
}

function uniqueSorted(values: number[]): number[] {
  return Array.from(new Set(values.map((item) => roundValue(item)))).sort((a, b) => a - b);
}

function createDropdownOptions(min?: number, max?: number, customOptions?: number[]): number[] {
  const isInRange = (value: number) =>
    (typeof min !== 'number' || value >= min) && (typeof max !== 'number' || value <= max);

  if (customOptions && customOptions.length > 0) {
    return uniqueSorted(customOptions).filter(isInRange);
  }

  const options: number[] = [];
  for (let value = 1; value <= 100; value += 1) {
    if (isInRange(value)) {
      options.push(value);
    }
  }
  return options;
}

function isSameNumber(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.000001;
}

export function NumberInput({
  size = 'xs',
  state = 'active',
  dropdownIcon = true,
  value,
  defaultValue = 10,
  min,
  max,
  step = 1,
  dropdownOptions,
  className,
  placeholder = '0',
  disabled,
  readOnly = false,
  onChange,
  onBlur,
  onKeyDown,
  onValueChange,
  onIncrement,
  onDecrement,
  onDropdownSelect,
  onDropdownClick,
  ...rest
}: NumberInputProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuScrollFrameRef = useRef<number | null>(null);
  const dropdownId = useId();
  const isControlled = value !== undefined;
  const initialValue = normalize(defaultValue, min, max);
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPositionStyle, setDropdownPositionStyle] = useState<DropdownPositionStyle>({});
  const [menuCanScrollUp, setMenuCanScrollUp] = useState(false);
  const [menuCanScrollDown, setMenuCanScrollDown] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState<string | null>(null);
  const resolvedValue = normalize(isControlled ? value : uncontrolledValue, min, max);
  const displayValue = isControlled ? String(resolvedValue) : inputText ?? String(resolvedValue);
  const effectiveValue = displayValue.trim() === '' ? 0 : resolvedValue;
  const selectedDropdownValue = normalize(effectiveValue, min, max);
  const resolvedDisabled = disabled || state === 'disable';
  const dropdownOpen = isDropdownOpen && !resolvedDisabled;
  const resolvedStep = Number.isFinite(step) && step > 0 ? step : 1;
  const decrementDisabled = resolvedDisabled || (typeof min === 'number' && effectiveValue <= min);
  const incrementDisabled = resolvedDisabled || (typeof max === 'number' && effectiveValue >= max);
  const fieldCharWidth = Math.max(2, displayValue.length || 1);
  const fieldStyle: CSSProperties = { width: `calc(${fieldCharWidth}ch + 0.3ch)` };
  const allowDecimal = isDecimalStep(resolvedStep);
  const allowNegative = typeof min === 'number' ? min < 0 : true;

  const resolvedDropdownOptions = useMemo(() => {
    return createDropdownOptions(min, max, dropdownOptions);
  }, [dropdownOptions, min, max]);
  const selectedOptionIndex = resolvedDropdownOptions.findIndex((option) =>
    isSameNumber(option, selectedDropdownValue),
  );

  const stopAutoScroll = useCallback(() => {
    if (menuScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(menuScrollFrameRef.current);
      menuScrollFrameRef.current = null;
    }
  }, []);

  const updateMenuScrollState = useCallback(() => {
    const menuElement = menuRef.current;
    if (!menuElement) return;
    const epsilon = 1;
    const maxScrollTop = menuElement.scrollHeight - menuElement.clientHeight;
    setMenuCanScrollUp(menuElement.scrollTop > epsilon);
    setMenuCanScrollDown(menuElement.scrollTop < maxScrollTop - epsilon);
  }, []);

  const startAutoScroll = useCallback(
    (direction: ScrollDirection) => {
      const menuElement = menuRef.current;
      if (!menuElement) return;

      stopAutoScroll();

      const step = () => {
        const currentMenu = menuRef.current;
        if (!currentMenu) return;

        const maxScrollTop = currentMenu.scrollHeight - currentMenu.clientHeight;
        const nextScrollTop = Math.max(0, Math.min(maxScrollTop, currentMenu.scrollTop + direction * 2));
        currentMenu.scrollTop = nextScrollTop;
        updateMenuScrollState();

        const reachedEdge = direction < 0 ? nextScrollTop <= 0 : nextScrollTop >= maxScrollTop;
        if (reachedEdge) {
          menuScrollFrameRef.current = null;
          return;
        }

        menuScrollFrameRef.current = window.requestAnimationFrame(step);
      };

      menuScrollFrameRef.current = window.requestAnimationFrame(step);
    },
    [stopAutoScroll, updateMenuScrollState],
  );

  const updateDropdownPosition = useCallback(() => {
    const middleElement = middleRef.current;
    const menuElement = menuContainerRef.current;
    if (!middleElement || !menuElement) return;

    const middleRect = middleElement.getBoundingClientRect();
    const rootStyle = rootRef.current
      ? window.getComputedStyle(rootRef.current)
      : window.getComputedStyle(middleElement);
    const readVar = (name: string) => {
      const value = rootStyle.getPropertyValue(name).trim();
      return value || undefined;
    };

    setDropdownPositionStyle({
      left: `${middleRect.left + middleRect.width / 2}px`,
      fontFamily: rootStyle.fontFamily,
      fontSize: rootStyle.fontSize,
      fontWeight: rootStyle.fontWeight,
      lineHeight: rootStyle.lineHeight,
      minWidth: `${middleRect.width + 2}px`,
      top: `${middleRect.top + middleRect.height / 2}px`,
      '--number-input-bg': readVar('--number-input-bg'),
      '--number-input-border': readVar('--number-input-border'),
      '--number-input-content': readVar('--number-input-content'),
      '--number-input-control-size': `${middleRect.height}px`,
      '--number-input-focus-ring': readVar('--number-input-focus-ring'),
      '--number-input-menu-selected-bg': readVar('--number-input-menu-selected-bg'),
      '--number-input-menu-selected-border': readVar('--number-input-menu-selected-border'),
      '--number-input-menu-selected-content': readVar('--number-input-menu-selected-content'),
    });
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const middleElement = middleRef.current;
    const menuElement = menuContainerRef.current;
    if (!middleElement || !menuElement) return;

    updateDropdownPosition();
    return autoUpdate(middleElement, menuElement, updateDropdownPosition);
  }, [dropdownOpen, updateDropdownPosition]);

  useEffect(() => {
    if (!dropdownOpen) {
      stopAutoScroll();
      return;
    }
    const selector =
      activeOptionIndex !== null
        ? `.pds-number-input__menu-item[data-index="${activeOptionIndex}"]`
        : '.pds-number-input__menu-item[data-selected="true"]';
    const selectedItem = menuRef.current?.querySelector<HTMLButtonElement>(selector);
    selectedItem?.scrollIntoView({ block: 'center' });
    window.requestAnimationFrame(updateMenuScrollState);
  }, [
    activeOptionIndex,
    dropdownOpen,
    resolvedDropdownOptions,
    selectedDropdownValue,
    stopAutoScroll,
    updateMenuScrollState,
  ]);

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  const setValue = (next: number) => {
    const normalized = normalize(next, min, max);
    if (!isControlled) {
      setUncontrolledValue(normalized);
    }
    onValueChange?.(normalized);
    return normalized;
  };

  const selectDropdownOptionByIndex = (index: number, triggerSelectEvent = false) => {
    if (resolvedDropdownOptions.length === 0) return;
    const boundedIndex = Math.max(0, Math.min(resolvedDropdownOptions.length - 1, index));
    const option = resolvedDropdownOptions[boundedIndex];
    if (option === undefined) return;

    const next = setValue(option);
    setInputText(null);
    setActiveOptionIndex(boundedIndex);
    if (triggerSelectEvent) {
      onDropdownSelect?.(next);
    }
  };

  const handleFieldKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const hasDropdownNavigation = dropdownIcon && resolvedDropdownOptions.length > 0;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!hasDropdownNavigation) {
        return;
      }

      event.preventDefault();
      if (resolvedDisabled || readOnly) return;

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const fallbackIndex = direction > 0 ? -1 : resolvedDropdownOptions.length;
      const currentIndex =
        activeOptionIndex ??
        (selectedOptionIndex >= 0 ? selectedOptionIndex : fallbackIndex);
      const nextIndex = Math.max(0, Math.min(resolvedDropdownOptions.length - 1, currentIndex + direction));

      if (!dropdownOpen) {
        setDropdownOpen(true);
      }
      selectDropdownOptionByIndex(nextIndex);
      return;
    }

    if (dropdownOpen && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      if (resolvedDisabled || readOnly) return;
      const index = event.key === 'Home' ? 0 : resolvedDropdownOptions.length - 1;
      selectDropdownOptionByIndex(index);
      return;
    }

    if (dropdownOpen && event.key === 'Enter') {
      event.preventDefault();
      const index = activeOptionIndex ?? selectedOptionIndex;
      if (index >= 0) {
        selectDropdownOptionByIndex(index, true);
      }
      setDropdownOpen(false);
      setActiveOptionIndex(null);
      return;
    }

    const allowedNavigation = new Set([
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
      'Enter',
      'Escape',
    ]);

    if (allowedNavigation.has(event.key)) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setActiveOptionIndex(null);
      }
      if (event.key === 'Tab' && dropdownOpen) {
        setActiveOptionIndex(null);
      }
      return;
    }

    if (/^[0-9]$/.test(event.key)) return;

    if (event.key === '.' && allowDecimal) {
      if (!event.currentTarget.value.includes('.')) return;
    }

    if (event.key === '-' && allowNegative) {
      if (event.currentTarget.selectionStart === 0 && !event.currentTarget.value.includes('-')) return;
    }

    event.preventDefault();
  };

  const handleFieldBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    if (event.defaultPrevented) return;

    const raw = event.currentTarget.value.trim();
    if (raw === '') {
      setInputText('');
      return;
    }

    const parsed = Number(event.currentTarget.value);
    if (Number.isNaN(parsed)) {
      setInputText(String(resolvedValue));
      return;
    }
    const normalized = setValue(parsed);
    setInputText(String(normalized));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.defaultPrevented) return;

    const raw = event.currentTarget.value;
    setInputText(raw);

    if (raw.trim() === '') {
      return;
    }

    const next = event.currentTarget.valueAsNumber;
    if (Number.isNaN(next)) return;
    const normalized = setValue(next);
    if (normalized !== next) {
      setInputText(String(normalized));
    }
  };

  const handleDecrement = () => {
    if (decrementDisabled) return;
    const next = setValue(effectiveValue - resolvedStep);
    setInputText(null);
    onDecrement?.(next);
  };

  const handleIncrement = () => {
    if (incrementDisabled) return;
    const next = setValue(effectiveValue + resolvedStep);
    setInputText(null);
    onIncrement?.(next);
  };

  const handleDropdownToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (resolvedDisabled) return;
    onDropdownClick?.(event);
    if (event.defaultPrevented) return;
    setDropdownOpen((current) => {
      const next = !current;
      if (next) {
        const initialIndex = selectedOptionIndex >= 0 ? selectedOptionIndex : 0;
        setActiveOptionIndex(initialIndex);
        window.requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      } else {
        setActiveOptionIndex(null);
      }
      return next;
    });
  };

  const handleDropdownSelect = (selected: number) => {
    if (resolvedDisabled) return;
    const next = setValue(selected);
    setInputText(null);
    onDropdownSelect?.(next);
    setDropdownOpen(false);
    setActiveOptionIndex(null);
  };

  const handleScrollPointerEnter =
    (direction: ScrollDirection) => () => {
      if (!dropdownOpen) return;
      if (direction < 0 && !menuCanScrollUp) return;
      if (direction > 0 && !menuCanScrollDown) return;
      startAutoScroll(direction);
    };

  const handleScrollPointerLeave = () => {
    stopAutoScroll();
  };

  useEffect(() => {
    if (!dropdownOpen) return;

    const handlePointerDown = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      if (menuContainerRef.current?.contains(target)) return;
      setDropdownOpen(false);
      setActiveOptionIndex(null);
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setActiveOptionIndex(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      stopAutoScroll();
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen, stopAutoScroll]);

  const dropdownMenu =
    dropdownOpen &&
    (typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuContainerRef}
            className="pds-number-input__menu"
            style={dropdownPositionStyle}
            onPointerLeave={handleScrollPointerLeave}
          >
            <button
              type="button"
              className="pds-number-input__menu-scroll pds-number-input__menu-scroll--start"
              aria-label="Scroll up"
              data-visible={menuCanScrollUp ? 'true' : 'false'}
              disabled={!menuCanScrollUp}
              tabIndex={-1}
              onPointerEnter={handleScrollPointerEnter(-1)}
              onPointerLeave={handleScrollPointerLeave}
            >
              <span className="pds-number-input__menu-scroll-icon" aria-hidden="true">
                <IconMenuPositionDown size="md" />
              </span>
            </button>
            <div
              id={dropdownId}
              ref={menuRef}
              role="listbox"
              className="pds-number-input__menu-list"
              onScroll={updateMenuScrollState}
            >
              {resolvedDropdownOptions.map((option, index) => {
                const active = activeOptionIndex === index;
                const selected = isSameNumber(option, selectedDropdownValue);
                return (
                  <button
                    key={option}
                    id={`${dropdownId}-option-${index}`}
                    type="button"
                    className="pds-number-input__menu-item"
                    role="option"
                    data-active={active ? 'true' : 'false'}
                    data-index={index}
                    aria-selected={selected}
                    data-selected={selected ? 'true' : 'false'}
                    tabIndex={active ? 0 : -1}
                    onFocus={() => setActiveOptionIndex(index)}
                    onClick={() => handleDropdownSelect(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="pds-number-input__menu-scroll pds-number-input__menu-scroll--end"
              aria-label="Scroll down"
              data-visible={menuCanScrollDown ? 'true' : 'false'}
              disabled={!menuCanScrollDown}
              tabIndex={-1}
              onPointerEnter={handleScrollPointerEnter(1)}
              onPointerLeave={handleScrollPointerLeave}
            >
              <span className="pds-number-input__menu-scroll-icon" aria-hidden="true">
                <IconMenuPositionDown size="md" />
              </span>
            </button>
          </div>,
          document.body,
        )
      : null);

  return (
    <div
      ref={rootRef}
      className={['pds-number-input', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={state}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-dropdown-open={dropdownOpen ? 'true' : 'false'}
    >
      <button
        type="button"
        className="pds-number-input__action pds-number-input__action--decrement"
        aria-label="Decrease value"
        disabled={decrementDisabled}
        onClick={handleDecrement}
      >
        <span className="pds-number-input__action-icon" aria-hidden="true">
          <IconRemove size="md" />
        </span>
      </button>

      <div ref={middleRef} className="pds-number-input__middle">
        <input
          {...rest}
          ref={inputRef}
          type="number"
          className="pds-number-input__field"
          style={fieldStyle}
          value={displayValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={resolvedStep}
          disabled={resolvedDisabled}
          readOnly={readOnly}
          aria-activedescendant={
            dropdownOpen && activeOptionIndex !== null ? `${dropdownId}-option-${activeOptionIndex}` : undefined
          }
          aria-controls={dropdownIcon ? dropdownId : undefined}
          aria-expanded={dropdownIcon ? dropdownOpen : undefined}
          onChange={handleInputChange}
          onKeyDown={handleFieldKeyDown}
          onBlur={handleFieldBlur}
        />

        {dropdownIcon && (
          <>
            <button
              type="button"
              className="pds-number-input__dropdown"
              aria-label="Open number options"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-controls={dropdownId}
              disabled={resolvedDisabled}
              onClick={handleDropdownToggle}
            >
              <IconMenuPositionDown size="md" />
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="pds-number-input__action pds-number-input__action--increment"
        aria-label="Increase value"
        disabled={incrementDisabled}
        onClick={handleIncrement}
      >
        <span className="pds-number-input__action-icon" aria-hidden="true">
          <IconAdd size="md" />
        </span>
      </button>
      {dropdownMenu}
    </div>
  );
}
