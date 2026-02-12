import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import * as PlanetIcons from '@justgo/planet-icons';
import { Chip } from './chip';

const defaultOnClick = fn();
const iconOptions = Object.keys(PlanetIcons)
  .filter((key) => key.startsWith('Icon'))
  .sort();

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '## Usage with Icon',
          '',
          '`leftIcon`, `rightIcon`, or `iconOnly` can be used with icon names from `@justgo/planet-icons`.',
          'For icon-only chips, always provide an `aria-label` for accessibility.',
          '',
          '```tsx',
          "import { Chip } from 'planet-design-system-v1';",
          "import { IconCloseStyleOutline } from '@justgo/planet-icons';",
          '',
          '<Chip leftIcon leftIconName="IconCloseStyleOutline">Pay Now</Chip>',
          '<Chip rightIcon rightIconName="IconCloseStyleOutline">Pay Now</Chip>',
          '<Chip iconOnly iconOnlyName="IconCloseStyleOutline" aria-label="Pay Now" />',
          '```',
          '',
          '## Imports',
          '',
          '```tsx',
          "import { Chip } from 'planet-design-system-v1';",
          "import type { ChipProps } from 'planet-design-system-v1';",
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
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
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
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
    children: 'Chip',
    type: 'primary',
    size: 'md',
    state: 'default',
    outline: false,
    rounded: false,
    iconOnly: false,
    leftIcon: false,
    rightIcon: false,
    leftIconName: 'IconCloseStyleOutline',
    rightIconName: 'IconCloseStyleOutline',
    iconOnlyName: 'IconCloseStyleOutline',
    onClick: {},
  },
  argTypes: {
    children: {
      control: 'text',
      name: 'text',
      description: 'Chip label',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label (required for icon-only chips).',
      if: { arg: 'iconOnly', truthy: true },
    },
    type: {
      control: 'select',
      description: 'Primary, Secondary, Error, Warning, Info, Complementary',
      options: [
        'primary',
        'secondary',
        'error',
        'warning',
        'info',
        'complementary',
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
      description: 'Whether the chip is outlined',
      name: 'outline?',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the chip is fully rounded',
      name: 'rounded?',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether the chip is icon only',
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
    onClick: {
      description: 'Click handler',
      control: { type: 'object' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

const types = [
  'primary',
  'secondary',
  'info',
  'warning',
  'error',
  'complementary',
] as const;

export const Default: Story = {
  render: (args) => <Chip {...args} onClick={defaultOnClick} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button');

    defaultOnClick.mockClear();
    await userEvent.click(chip);
    await expect(defaultOnClick).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    await expect(chip).toHaveFocus();

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

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Chip key={size} size={size}>
          {size}
        </Chip>
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
    leftIcon: true,
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
      }}
    >
      {types.map((type) => (
        <Chip key={type} type={type}>
          {type}
        </Chip>
      ))}
    </div>
  ),
};

export const AllTypesWithIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
      }}
    >
      {types.map((type) => (
        <Chip key={type} type={type} leftIcon rightIcon>
          {type}
        </Chip>
      ))}
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: 'This is a very long chip label intended to test overflow behavior',
  },
};

export const WithLeftAndRightIcon: Story = {
  args: {
    leftIcon: true,
    rightIcon: true,
    children: 'With Left and Right icon',
  },
};
