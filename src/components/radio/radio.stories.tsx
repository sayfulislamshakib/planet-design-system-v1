import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radios let people select one option from a set.',
          '',
          '```tsx',
          "import { Radio } from 'planet-design-system-v1';",
          '',
          '<Radio name="plan">Monthly</Radio>',
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
  },
  args: {
    children: 'Radio',
    size: 'md',
    disabled: false,
    state: 'default',
  },
  argTypes: {
    children: {
      control: 'text',
      name: 'label',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: {
      control: 'boolean',
    },
    state: {
      control: 'select',
      options: ['default', 'error'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Radio size="sm" name="sizes">Small</Radio>
      <Radio size="md" name="sizes">Medium</Radio>
    </div>
  ),
};
