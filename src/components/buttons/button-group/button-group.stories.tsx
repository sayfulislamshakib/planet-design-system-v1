import type { Meta, StoryObj } from '@storybook/react';
import * as PlanetIcons from '@justgo/planet-icons';
import { Button } from '../button/button';
import { ButtonGroup } from './button-group';

const iconOptions = Object.keys(PlanetIcons)
  .filter((key) => key.startsWith('Icon'))
  .sort();

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Groups 2 to 5 buttons as a single control.',
          'Use `size` to apply a shared button size and `count` to enforce the exact number of buttons.',
          'The group supports `type` (primary/secondary), `outline`, `rounded`, `iconOnly`, and icons.',
          '',
          '## Usage',
          '',
          '```tsx',
          "import { Button, ButtonGroup } from 'planet-design-system-v1';",
          '',
          '<ButtonGroup>',
          '  <Button>Left</Button>',
          '  <Button>Middle</Button>',
          '  <Button>Right</Button>',
          '</ButtonGroup>',
          '',
          '<ButtonGroup size="sm" count={2} type="secondary" outline>',
          '  <Button>Left</Button>',
          '  <Button>Right</Button>',
          '</ButtonGroup>',
          '',
          '<ButtonGroup leftIcon leftIconName="IconCloseStyleOutline">',
          '  <Button>First</Button>',
          '  <Button>Second</Button>',
          '</ButtonGroup>',
          '```',
          '',
          '## Imports',
          '',
          '```tsx',
          "import { Button, ButtonGroup } from 'planet-design-system-v1';",
          "import type { ButtonGroupProps } from 'planet-design-system-v1';",
          '```',
          '',
          'For icon-only buttons, provide an `aria-label` on each Button.',
        ].join('\n'),
      },
    },
  },
  args: {
    size: 'md',
    count: 3,
    type: 'secondary',
    outline: true,
    rounded: false,
    iconOnly: false,
    iconOnlyName: 'IconCloseStyleOutline',
    leftIcon: false,
    rightIcon: false,
    leftIconName: 'IconCloseStyleOutline',
    rightIconName: 'IconCloseStyleOutline',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Shared size for all buttons in the group.',
    },
    count: {
      control: 'select',
      options: [2, 3, 4, 5],
      description: 'Exact number of buttons expected in the group.',
    },
    type: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Primary or Secondary group style.',
    },
    outline: {
      control: 'boolean',
      name: 'outline?',
      description: 'Whether the group uses outlined buttons.',
    },
    rounded: {
      control: 'boolean',
      name: 'rounded?',
      description: 'Whether the buttons are fully rounded.',
    },
    iconOnly: {
      control: 'boolean',
      name: 'iconOnly?',
      description: 'Whether the buttons are icon-only.',
    },
    iconOnlyName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Icon-only icon (from Planet Icons). Used when iconOnly is true.',
      if: { arg: 'iconOnly', truthy: true },
    },
    leftIcon: {
      control: 'boolean',
      name: 'leftIcon?',
      description: 'Whether to show an icon on the left side.',
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
      name: 'rightIcon?',
      description: 'Whether to show an icon on the right side.',
      if: { arg: 'iconOnly', truthy: false },
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

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup
      size={args.size}
      count={args.count}
      type={args.type}
      outline={args.outline}
      rounded={args.rounded}
      iconOnly={args.iconOnly}
      iconOnlyName={args.iconOnlyName}
      leftIcon={args.leftIcon}
      rightIcon={args.rightIcon}
      leftIconName={args.leftIconName}
      rightIconName={args.rightIconName}
    >
      {Array.from({ length: args.count ?? 3 }).map((_, index) => (
        <Button key={index}>Button {index + 1}</Button>
      ))}
    </ButtonGroup>
  ),
};

export const TwoButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Left</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const ThreeButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const FiveButtons: Story = {
  render: () => (
    <ButtonGroup>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
      <Button>Four</Button>
      <Button>Five</Button>
    </ButtonGroup>
  ),
};

export const SizedWithCount: Story = {
  render: () => (
    <ButtonGroup size="sm" count={2}>
      <Button>Left</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};
