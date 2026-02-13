import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A toggle or switch is a small, manually operated electrical switch that turns a circuit on or off.',
          'Toggle switches, such as lamps, appliances, and power tools, are typically used in devices that must be turned on or off frequently.',
          '',
          '```tsx',
          "import { Toggle } from 'planet-design-system-v1';",
          '',
          '<Toggle />',
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
  },
  args: {
    size: 'md',
    type: 'regular',
    state: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    type: {
      control: 'select',
      options: ['regular', 'text', 'icon'],
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'disabled'],
    },
    defaultChecked: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toggle type="regular" />
      <Toggle type="regular" defaultChecked />
      <Toggle type="text" />
      <Toggle type="text" defaultChecked />
      <Toggle type="icon" />
      <Toggle type="icon" defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toggle size="xs" />
      <Toggle size="sm" />
      <Toggle size="md" />
      <Toggle size="lg" />
      <Toggle size="xl" />
    </div>
  ),
};
