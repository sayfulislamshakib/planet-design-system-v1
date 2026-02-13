import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './number-input';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/Number Input',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: ['size', 'state', 'dropdownIcon', 'defaultValue', 'min', 'max', 'step', 'readOnly'],
    },
    docs: {
      description: {
        component: [
          'Number incrementer helps users decrease or increase values using minus/plus actions.',
          'Optional dropdown icon can be used to open number presets.',
          '',
          '```tsx',
          "import { NumberInput } from 'planet-design-system-v1';",
          '',
          '<NumberInput size="md" defaultValue={10} />',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    size: 'md',
    state: 'active',
    dropdownIcon: true,
    defaultValue: 10,
    min: 1,
    max: 100,
    step: 1,
    readOnly: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant from XS to XL.',
      table: { defaultValue: { summary: 'md' } },
    },
    state: {
      control: 'select',
      options: ['active', 'disable'],
      description: 'Visual and interaction state.',
      table: { defaultValue: { summary: 'active' } },
    },
    dropdownIcon: {
      control: 'boolean',
      name: 'dropdownIcon?',
      description: 'Shows the optional dropdown indicator/action.',
      table: { defaultValue: { summary: 'true' } },
    },
    defaultValue: {
      control: 'number',
      description: 'Initial value for uncontrolled usage.',
      table: { defaultValue: { summary: '10' } },
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value.',
      table: { defaultValue: { summary: '1' } },
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value.',
      table: { defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'Step used by increment/decrement buttons.',
      table: { defaultValue: { summary: '1' } },
    },
    readOnly: {
      control: 'boolean',
      name: 'readOnly?',
      description: 'If true, users cannot type into the middle input.',
      table: { defaultValue: { summary: 'false' } },
    },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onIncrement: { table: { disable: true } },
    onDecrement: { table: { disable: true } },
    onDropdownClick: { table: { disable: true } },
    onDropdownSelect: { table: { disable: true } },
    dropdownOptions: { table: { disable: true } },
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'All supported size variants in active state.',
      },
    },
  },
  render: (args) => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {sizes.map((size) => (
          <NumberInput key={size} {...args} size={size} />
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    state: 'disable',
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled example with `onValueChange` and external state.',
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState(10);

    return (
      <div style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
        <NumberInput {...args} value={value} onValueChange={setValue} />
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#455a64' }}>
          Value: {value}
        </div>
      </div>
    );
  },
};
