import type { CSSProperties } from 'react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../button/button';
import type { ButtonProps } from '../button/button';
import './button-split.css';

export type SplitButtonMenuItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SplitButtonProps = ButtonProps & {
  onSplitClick?: ButtonProps['onClick'];
  splitAriaLabel?: string;
  menuItems?: SplitButtonMenuItem[];
  onMenuSelect?: (item: SplitButtonMenuItem) => void;
};

export function SplitButton(props: SplitButtonProps) {
  const {
    children,
    className,
    onClick,
    onSplitClick,
    iconOnlyName,
    leftIcon,
    rightIcon,
    leftIconName,
    rightIconName,
    fullWidth = false,
    splitAriaLabel,
    menuItems,
    onMenuSelect,
    style,
    ...rest
  } = props;

  const hasMenu = Boolean(menuItems && menuItems.length > 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAlign, setMenuAlign] = useState<'left' | 'right'>('left');
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const mainWrapRef = useRef<HTMLSpanElement>(null);
  const [mainHeight, setMainHeight] = useState<number | null>(null);

  const resolvedOnClick = typeof onClick === 'function' ? onClick : undefined;
  const resolvedSplitOnClick = typeof onSplitClick === 'function' ? onSplitClick : resolvedOnClick;
  const resolvedIconOnlyName =
    iconOnlyName ?? rightIconName ?? leftIconName ?? 'IconMenuPositionDown';
  const { 'aria-label': ariaLabel, ...buttonProps } = rest;
  const resolvedSplitAriaLabel =
    splitAriaLabel ?? ariaLabel ?? (typeof children === 'string' ? `${children} options` : undefined);

  useEffect(() => {
    if (!hasMenu) setMenuOpen(false);
  }, [hasMenu]);

  useLayoutEffect(() => {
    const element = mainWrapRef.current;
    if (!element) return;

    const update = () => {
      const height = element.getBoundingClientRect().height;
      if (!Number.isNaN(height) && height > 0) setMainHeight(height);
    };

    update();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const menuEl = menuRef.current;
    const anchorEl = iconWrapRef.current;
    if (!menuEl || !anchorEl) return;

    const menuWidth = menuEl.getBoundingClientRect().width;
    const anchorRect = anchorEl.getBoundingClientRect();
    const spaceRight = window.innerWidth - anchorRect.left;

    setMenuAlign(menuWidth <= spaceRight ? 'left' : 'right');
  }, [menuOpen, menuItems?.length]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || iconWrapRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    const handleResize = () => {
      const menuEl = menuRef.current;
      const anchorEl = iconWrapRef.current;
      if (!menuEl || !anchorEl) return;
      const menuWidth = menuEl.getBoundingClientRect().width;
      const anchorRect = anchorEl.getBoundingClientRect();
      const spaceRight = window.innerWidth - anchorRect.left;
      setMenuAlign(menuWidth <= spaceRight ? 'left' : 'right');
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  const outlined = rest.outline === true;
  const mergedStyle = {
    ...style,
    ...(mainHeight ? { '--pds-split-button-height': `${mainHeight}px` } : null),
  } as CSSProperties;

  return (
    <div
      className="pds-split-button"
      data-full-width={fullWidth ? 'true' : 'false'}
      data-outline={outlined ? 'true' : 'false'}
      style={mergedStyle}
    >
      <span ref={mainWrapRef} className="pds-split-button__item">
        <Button
          {...buttonProps}
          className={['pds-split-button__main', className].filter(Boolean).join(' ')}
          onClick={resolvedOnClick}
          iconOnly={false}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          leftIconName={leftIconName}
          rightIconName={rightIconName}
        >
          {children}
        </Button>
        {!outlined && <span className="pds-split-button__divider" aria-hidden="true" />}
      </span>
      <span ref={iconWrapRef} className="pds-split-button__icon-wrap">
        <Button
          {...buttonProps}
          className={['pds-split-button__icon', className].filter(Boolean).join(' ')}
          onClick={(event) => {
            resolvedSplitOnClick?.(event);
            if (hasMenu) setMenuOpen((current) => !current);
          }}
          iconOnly={true}
          iconOnlyName={resolvedIconOnlyName}
          leftIcon={false}
          rightIcon={false}
          aria-label={resolvedSplitAriaLabel}
          aria-haspopup={hasMenu ? 'menu' : undefined}
          aria-expanded={hasMenu ? menuOpen : undefined}
          aria-controls={hasMenu ? menuId : undefined}
          data-menu-open={menuOpen ? 'true' : 'false'}
        />
        {hasMenu && menuOpen && (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className="pds-split-button__menu"
            data-align={menuAlign}
          >
            {menuItems?.map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                className="pds-split-button__menu-item"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  onMenuSelect?.(item);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </span>
    </div>
  );
}
