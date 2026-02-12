import type { Meta, StoryObj } from '@storybook/react';
import * as PlanetIcons from '@justgo/planet-icons';
import { Link } from './link';

const iconOptions = Object.keys(PlanetIcons)
  .filter((key) => key.startsWith('Icon'))
  .sort();

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Links take people to a new location in the product or another website.',
          '',
          '```tsx',
          "import { Link } from 'planet-design-system-v1';",
          '',
          '<Link href="/billing" leftIcon rightIcon>Billing</Link>',
          '```',
          '',
          '## Imports',
          '',
          '```tsx',
          "import { Link } from 'planet-design-system-v1';",
          "import type { LinkProps } from 'planet-design-system-v1';",
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
    controls: { sort: 'none' },
  },
  args: {
    children: 'Link',
    href: '#',
    type: 'primary',
    size: 'md',
    state: 'default',
    underline: false,
    leftIcon: false,
    rightIcon: false,
    leftIconName: 'IconChevronRightStyleOutline',
    rightIconName: 'IconChevronRightStyleOutline',
  },
  argTypes: {
    children: {
      control: 'text',
      name: 'text',
      description: 'Link label',
    },
    href: {
      control: 'text',
      description: 'Destination URL',
    },
    type: {
      control: 'select',
      description: 'Regular, Primary, Secondary, Info, Warning, Error, Visited, Inverse',
      options: ['regular', 'primary', 'secondary', 'info', 'warning', 'error', 'visited', 'inverse'],
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
    underline: {
      control: 'boolean',
      description: 'Whether to show the underline',
      name: 'underline?',
    },
    leftIcon: {
      control: 'boolean',
      description: 'Whether to show an icon on the left side',
      name: 'leftIcon?',
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
    },
    rightIconName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Right icon (from Planet Icons). Used when rightIcon is true.',
      if: { arg: 'rightIcon', truthy: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

const types = ['regular', 'primary', 'secondary', 'info', 'warning', 'error', 'visited', 'inverse'] as const;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Link key={size} size={size} leftIcon rightIcon>
          {size}
        </Link>
      ))}
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      {types.map((type) => (
        <Link key={type} type={type} leftIcon rightIcon>
          {type}
        </Link>
      ))}
    </div>
  ),
};

export const NoUnderline: Story = {
  args: {
    underline: false,
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
  },
};

export const Focused: Story = {
  args: {
    state: 'focus',
  },
};
