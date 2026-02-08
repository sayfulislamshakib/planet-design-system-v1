import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import * as PlanetIcons from '@justgo/planet-icons';
import { Button } from './button';

const defaultOnClick = fn();
const iconOptions = Object.keys(PlanetIcons)
  .filter((key) => key.startsWith('Icon'))
  .sort();

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      canvas: { layout: 'fullscreen', sourceState: 'shown' },
      source: { type: 'dynamic' },
    },
    controls: {
      sort: 'none',
    },
  },
  decorators: [
    (Story, context) => {
      const [{ iconOnly, leftIcon, rightIcon }, updateArgs] = useArgs();

      useEffect(() => {
        if (iconOnly && (leftIcon || rightIcon)) {
          updateArgs({ leftIcon: false, rightIcon: false });
        }
      }, [iconOnly, leftIcon, rightIcon, updateArgs]);

      const style = context.args.fullWidth
        ? { width: '100%', maxWidth: '100%', minWidth: '100%', display: 'block' }
        : { display: 'flex', justifyContent: 'center' };

      return (
        <div style={style}>
          <div
            style={{
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              padding: '0 32px',
              boxSizing: 'border-box',
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
  args: {
    children: 'Button',
    type: 'primary',
    size: 'md',
    state: 'default',
    outline: false,
    iconOnly: false,
    leftIcon: false,
    rightIcon: false,
    leftIconName: 'IconCloseStyleOutline',
    rightIconName: 'IconCloseStyleOutline',
    iconOnlyName: 'IconCloseStyleOutline',
    fullWidth: false,
    onClick: {},
  },
  argTypes: {
    children: {
      control: 'text',
      name: 'text',
      description: 'Button Label',
    },
    type: {
      control: 'select',
      description: 'Primary, Secondary, Error, Warning, Info, Success, Complementary, Transparent',
      options: [
        'primary',
        'secondary',
        'error',
        'warning',
        'info',
        'success',
        'complementary',
        'transparent',
      ],
    },
    size: {
      control: 'select',
      description: 'xs, sm, md, lg, xl',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    state: {
      control: 'select',
      description: 'default, hover, pressed, focus, disabled',
      options: ['default', 'hover', 'pressed', 'focus', 'disabled'],
    },
    outline: {
      control: 'boolean',
      description: 'Whether the button is outlined',
      name: 'outline?',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether the button is icon only',
      name: 'iconOnly?',
    },
    iconOnlyName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Icon-only icon (from Planet Icons). Used when iconOnly is true.',
      if: { arg: 'iconOnly', truthy: true },
    },
    leftIcon: {
      control: 'boolean',
      description: 'Whether to show an icon on the left side',
      name: 'leftIcon?',
      if: { arg: 'iconOnly', truthy: false },
    },
    leftIconName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Left icon (from Planet Icons). Used when leftIcon is true.',
      if: { arg: 'leftIcon', truthy: true },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Whether to show an icon on the right side',
      name: 'rightIcon?',
      if: { arg: 'iconOnly', truthy: false },
    },
    rightIconName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Right icon (from Planet Icons). Used when rightIcon is true.',
      if: { arg: 'rightIcon', truthy: true },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should span full width',
      name: 'fullWidth?',
      if: { arg: 'iconOnly', truthy: false },
    },
    onClick: {
      description: 'Click handler',
      control: { type: 'object' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

const types = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
  'complementary',
  'transparent',
] as const;

export const Default: Story = {
  render: (args) => <Button {...args} onClick={defaultOnClick} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    defaultOnClick.mockClear();
    await userEvent.click(button);
    await expect(defaultOnClick).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(defaultOnClick).toHaveBeenCalledTimes(2);
  },
};

export const Primary: Story = {
  args: {
    type: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
  },
};

export const Complementary: Story = {
  args: {
    type: 'complementary',
  },
};

export const Transparent: Story = {
  args: {
    type: 'transparent',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
  },
};

export const Outline: Story = {
  args: {
    outline: true,
  },
};

export const LeftIcon: Story = {
  args: {
    children: 'Left icon',
  },
};

export const RightIcon: Story = {
  args: {
    rightIcon: true,
    children: 'Right icon',
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    'aria-label': 'Add',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
      }}
    >
      {types.map((type) => (
        <Button key={type} type={type}>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const AllTypesWithIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}
    >
      {types.map((type) => (
        <Button key={type} type={type} leftIcon rightIcon>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: 'This is a very long button label intended to test overflow behavior',
  },
};

export const WithLeftAndRightIcon: Story = {
  args: {
    leftIcon: true,
    rightIcon: true,
    children: 'With Left and Right icon',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full width button',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      canvas: { layout: 'fullscreen', className: 'pds-docs-fullwidth' },
    },
  },
};
