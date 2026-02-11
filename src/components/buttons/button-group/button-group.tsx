import type { HTMLAttributes, ReactElement } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import type { ButtonProps, ButtonSize, ButtonType } from '../button/button';
import './button-group.css';

type ButtonGroupChild = ReactElement<ButtonProps>;

type ButtonGroupChildren = ButtonGroupChild | ButtonGroupChild[];

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ButtonGroupChildren;
  size?: ButtonSize;
  count?: 2 | 3 | 4 | 5;
  type?: Extract<ButtonType, 'primary' | 'secondary'>;
  outline?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  iconOnlyName?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftIconName?: string;
  rightIconName?: string;
};

export function ButtonGroup({
  children,
  className,
  size,
  count,
  type = 'secondary',
  outline = true,
  rounded,
  iconOnly,
  iconOnlyName,
  leftIcon,
  rightIcon,
  leftIconName,
  rightIconName,
  ...rest
}: ButtonGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ButtonGroupChild[];
  const expectedCount = count ?? items.length;

  if (expectedCount < 2 || expectedCount > 5) {
    console.warn(`ButtonGroup count must be between 2 and 5. Received ${expectedCount}.`);
    return null;
  }

  if (items.length !== expectedCount) {
    console.warn(`ButtonGroup requires ${expectedCount} Button children. Received ${items.length}.`);
    return null;
  }

  const renderedItems = items.map((child, index) => {
    const nextProps: Partial<ButtonProps> = {};

    if (size && child.props.size == null) nextProps.size = size;
    if (type && child.props.type == null) nextProps.type = type;
    if (outline != null && child.props.outline == null) nextProps.outline = outline;
    if (rounded != null && child.props.rounded == null) nextProps.rounded = rounded;
    if (iconOnly != null && child.props.iconOnly == null) nextProps.iconOnly = iconOnly;
    if (iconOnlyName && child.props.iconOnlyName == null) nextProps.iconOnlyName = iconOnlyName;
    if (leftIcon != null && child.props.leftIcon == null) nextProps.leftIcon = leftIcon;
    if (rightIcon != null && child.props.rightIcon == null) nextProps.rightIcon = rightIcon;
    if (leftIconName && child.props.leftIconName == null) nextProps.leftIconName = leftIconName;
    if (rightIconName && child.props.rightIconName == null) nextProps.rightIconName = rightIconName;

    if (Object.keys(nextProps).length === 0) return child;
    return cloneElement(child, { ...nextProps, key: child.key ?? index });
  });

  const outlined = outline !== false;

  return (
    <div
      {...rest}
      role="group"
      data-outline={outline ? 'true' : 'false'}
      className={['pds-button-group', className].filter(Boolean).join(' ')}
    >
      {renderedItems.map((child, index) => (
        <span key={child.key ?? index} className="pds-button-group__item">
          {child}
          {!outlined && index < renderedItems.length - 1 && (
            <span className="pds-button-group__divider" aria-hidden="true" />
          )}
        </span>
      ))}
    </div>
  );
}
