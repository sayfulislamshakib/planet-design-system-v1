import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { arrow, autoUpdate, flip, offset, shift, useFloating, type Placement } from '@floating-ui/react-dom';
import { createPortal } from 'react-dom';
import './tooltip.css';

export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipColor = 'dark' | 'light';
export type TooltipType = 'regular' | 'label';
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export type TooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children?: ReactNode;
  content?: ReactNode;
  size?: TooltipSize;
  color?: TooltipColor;
  type?: TooltipType;
  placement?: TooltipPlacement;
  align?: TooltipAlign;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showDelay?: number;
  hideDelay?: number;
  tooltipClassName?: string;
  maxWidth?: number | string;
};

const staticSideMap: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};
const arrowStartEndOffset = '8px';

function toFloatingPlacement(placement: TooltipPlacement, align: TooltipAlign): Placement {
  if (align === 'center') return placement;
  return `${placement}-${align}`;
}

function mergeDescribedBy(
  existing: unknown,
  tooltipId: string,
  isOpen: boolean,
): string | undefined {
  if (!isOpen) {
    return typeof existing === 'string' ? existing : undefined;
  }

  const parts = new Set<string>();
  if (typeof existing === 'string') {
    existing
      .split(' ')
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => parts.add(part));
  }
  parts.add(tooltipId);
  return Array.from(parts).join(' ');
}

export function Tooltip({
  children,
  content,
  size = 'sm',
  color = 'dark',
  type = 'regular',
  placement = 'top',
  align = 'center',
  open,
  defaultOpen = false,
  onOpenChange,
  showDelay = 120,
  hideDelay = 0,
  className,
  tooltipClassName,
  maxWidth,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}: TooltipProps) {
  const tooltipId = useId();
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null);
  const [floatingElement, setFloatingElement] = useState<HTMLSpanElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLSpanElement | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const showArrow = type === 'regular';
  const effectiveContent = content ?? 'This is a tool tip';

  const isControlled = open !== undefined;
  const triggerIsDisabled =
    isValidElement(children) &&
    (() => {
      const props = children.props as Record<string, unknown>;
      return props.disabled === true || props['aria-disabled'] === true || props['aria-disabled'] === 'true';
    })();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const visible = triggerIsDisabled ? false : isControlled ? Boolean(open) : uncontrolledOpen;

  const floatingPlacement = useMemo(
    () => toFloatingPlacement(placement, align),
    [placement, align],
  );
  const middleware = useMemo(
    () => [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      ...(showArrow && arrowElement ? [arrow({ element: arrowElement, padding: 8 })] : []),
    ],
    [showArrow, arrowElement],
  );
  const { floatingStyles, middlewareData, placement: resolvedPlacement, update } = useFloating({
    placement: floatingPlacement,
    strategy: 'fixed',
    open: visible,
    middleware,
    elements: {
      reference: referenceElement,
      floating: floatingElement,
    },
    whileElementsMounted: autoUpdate,
  });
  const resolvedSide = resolvedPlacement.split('-')[0] as TooltipPlacement;
  const resolvedAlign = (resolvedPlacement.split('-')[1] ?? 'center') as TooltipAlign;

  const setVisible = (nextOpen: boolean) => {
    if (triggerIsDisabled && nextOpen) return;
    if (!isControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const clearTimer = (timer: number | null) => {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
  };

  const clearTimers = () => {
    clearTimer(showTimerRef.current);
    clearTimer(hideTimerRef.current);
    showTimerRef.current = null;
    hideTimerRef.current = null;
  };

  const supportsHover = () => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(hover: hover)').matches;
  };

  const scheduleShow = () => {
    if (triggerIsDisabled) return;
    clearTimer(hideTimerRef.current);
    hideTimerRef.current = null;

    if (showDelay <= 0) {
      setVisible(true);
      return;
    }

    clearTimer(showTimerRef.current);
    showTimerRef.current = window.setTimeout(() => {
      setVisible(true);
      showTimerRef.current = null;
    }, showDelay);
  };

  const scheduleHide = () => {
    clearTimer(showTimerRef.current);
    showTimerRef.current = null;

    if (hideDelay <= 0) {
      setVisible(false);
      return;
    }

    clearTimer(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, hideDelay);
  };

  useEffect(() => {
    return () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    update();
  }, [visible, effectiveContent, size, color, type, maxWidth, update]);

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerEnter?.(event);
    if (event.defaultPrevented) return;
    if (event.pointerType !== 'mouse' || !supportsHover()) return;
    scheduleShow();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerLeave?.(event);
    if (event.defaultPrevented) return;
    if (event.pointerType !== 'mouse' || !supportsHover()) return;
    scheduleHide();
  };

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    onFocus?.(event);
    if (event.defaultPrevented) return;
    scheduleShow();
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    onBlur?.(event);
    if (event.defaultPrevented) return;

    const nextFocused = event.relatedTarget;
    if (nextFocused instanceof Node && rootRef.current?.contains(nextFocused)) {
      return;
    }

    scheduleHide();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      clearTimers();
      setVisible(false);
    }
  };

  const arrowCrossAxisStyle: CSSProperties =
    resolvedAlign === 'start'
      ? resolvedSide === 'top' || resolvedSide === 'bottom'
        ? { left: arrowStartEndOffset, right: 'auto' }
        : { top: arrowStartEndOffset, bottom: 'auto' }
      : resolvedAlign === 'end'
        ? resolvedSide === 'top' || resolvedSide === 'bottom'
          ? { right: arrowStartEndOffset, left: 'auto' }
          : { bottom: arrowStartEndOffset, top: 'auto' }
        : {
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : undefined,
            top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : undefined,
          };

  const arrowStyle: CSSProperties | undefined = showArrow
    ? {
        ...arrowCrossAxisStyle,
        [staticSideMap[resolvedSide]]: 'calc(var(--tooltip-arrow-size, 6px) * -1)',
      }
    : undefined;

  const tooltipNode = (
    <span
      id={tooltipId}
      ref={setFloatingElement}
      role="tooltip"
      aria-hidden={visible ? undefined : 'true'}
      className={['pds-tooltip', tooltipClassName].filter(Boolean).join(' ')}
      data-floating={children ? 'true' : 'false'}
      data-size={size}
      data-color={color}
      data-type={type}
      data-side={resolvedSide}
      data-open={visible ? 'true' : 'false'}
      style={children ? { ...floatingStyles, maxWidth } : maxWidth ? { maxWidth } : undefined}
    >
      <span className="pds-tooltip__content">{effectiveContent}</span>
      {showArrow && (
        <span
          ref={setArrowElement}
          className="pds-tooltip__arrow"
          aria-hidden="true"
          style={arrowStyle}
        />
      )}
    </span>
  );

  if (!children) {
    return (
      <span
        {...rest}
        className={['pds-tooltip', className].filter(Boolean).join(' ')}
        data-floating="false"
        data-size={size}
        data-color={color}
        data-type={type}
        data-side={placement}
        data-open="true"
        style={maxWidth ? { maxWidth } : undefined}
      >
        <span className="pds-tooltip__content">{effectiveContent}</span>
        {showArrow && <span className="pds-tooltip__arrow" aria-hidden="true" />}
      </span>
    );
  }

  let triggerNode: ReactNode = children;
  if (isValidElement(children)) {
    const trigger = children as ReactElement<{ 'aria-describedby'?: string }>;
    triggerNode = cloneElement(trigger, {
      'aria-describedby': mergeDescribedBy(trigger.props['aria-describedby'], tooltipId, visible),
    });
  }

  return (
    <span
      {...rest}
      ref={(node) => {
        rootRef.current = node;
        setReferenceElement(node);
      }}
      className={['pds-tooltip-root', className].filter(Boolean).join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {triggerNode}
      {typeof document !== 'undefined' ? createPortal(tooltipNode, document.body) : tooltipNode}
    </span>
  );
}
