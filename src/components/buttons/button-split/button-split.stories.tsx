import type { Meta, StoryObj } from '@storybook/react';
import * as PlanetIcons from '@justgo/planet-icons';
import { SplitButton } from './button-split';

const iconOptions = Object.keys(PlanetIcons)
  .filter((key) => key.startsWith('Icon'))
  .sort();

const meta: Meta<typeof SplitButton> = {
  title: 'Components/ButtonSplit',
  id: 'components-splitbutton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A split button composed of a primary action and a secondary icon-only action.',
          '',
          '## Usage',
          '',
          '```tsx',
          "import { SplitButton } from 'planet-design-system-v1';",
          '',
          '<SplitButton',
          '  iconOnlyName="IconMenuPositionDown"',
          '  menuItems={[{ label: "Edit", value: "edit" }, { label: "Delete", value: "delete" }]}',
          '  onMenuSelect={(item) => console.log(item)}',
          '>',
          '  Pay Now',
          '</SplitButton>',
          '```',
          '',
          '## Imports',
          '',
          '```tsx',
          "import { SplitButton } from 'planet-design-system-v1';",
          "import type { SplitButtonProps } from 'planet-design-system-v1';",
          '```',
          '',
          'For icon-only actions, provide `splitAriaLabel` for accessibility.',
        ].join('\n'),
      },
    },
  },
  args: {
    children: 'Split Button',
    type: 'primary',
    size: 'md',
    state: 'default',
    outline: false,
    rounded: false,
    leftIcon: false,
    rightIcon: false,
    leftIconName: 'IconCloseStyleOutline',
    rightIconName: 'IconCloseStyleOutline',
    iconOnlyName: 'IconMenuPositionDown',
    menuItems: [
      { label: 'Edit', value: 'edit' },
      { label: 'Delete', value: 'delete' },
    ],
    fullWidth: false,
    splitAriaLabel: 'More options',
    onClick: {},
    onSplitClick: {},
    onMenuSelect: {},
  },
  argTypes: {
    children: {
      control: 'text',
      name: 'text',
      description: 'Main button label',
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
    rounded: {
      control: 'boolean',
      description: 'Whether the button is fully rounded',
      name: 'rounded?',
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
    iconOnlyName: {
      control: { type: 'select' },
      options: iconOptions,
      description: 'Icon-only icon (from Planet Icons) for the split action.',
    },
    menuItems: {
      control: { type: 'object' },
      description: 'Menu items shown when the split icon is clicked.',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the split button should span full width',
      name: 'fullWidth?',
    },
    splitAriaLabel: {
      control: 'text',
      description: 'Accessible label for the split icon button',
    },
    onMenuSelect: {
      description: 'Menu item select handler',
      control: { type: 'object' },
    },
    onClick: {
      description: 'Main button click handler',
      control: { type: 'object' },
    },
    onSplitClick: {
      description: 'Split icon button click handler',
      control: { type: 'object' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SplitButton>;

export const ButtonSplit: Story = {
  name: 'ButtonSplit',
};
