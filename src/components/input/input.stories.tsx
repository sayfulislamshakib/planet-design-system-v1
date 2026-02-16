import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'size',
        'type',
        'state',
        'hover',
        'hover?',
        'focus',
        'focus?',
        'label',
        'label?',
        'labelText',
        'required',
        'required?',
        'labelIcon',
        'labelIcon?',
        'labelPosition',
        'placeholder',
        'showHelperText',
        'HelperText?',
        'helperText',
        'leftIcon',
        'leftIcon?',
        'rightIcon',
        'rightIcon?',
      ],
    },
    docs: {
      description: {
        component: [
          'Text input with label, helper text, and left/right icon slots.',
          '',
          '```tsx',
          "import { Input } from 'planet-design-system-v1';",
          '',
          '<Input labelText="Label" placeholder="Placeholder text" />',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    size: 'md',
    type: 'regular',
    state: 'default',
    hover: false,
    focus: false,
    label: true,
    labelText: 'Label',
    required: false,
    labelIcon: false,
    labelPosition: 'top',
    placeholder: 'Placeholder text',
    showHelperText: false,
    helperText: 'Your helper text',
    leftIcon: false,
    rightIcon: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Input size variant.',
    },
    type: {
      control: 'select',
      options: ['regular', 'success', 'error'],
      description: 'Semantic color type.',
    },
    state: {
      control: 'select',
      options: ['default', 'filled', 'disable'],
      description: 'Base visual state.',
    },
    hover: {
      control: 'boolean',
      description: 'Forces hover style for preview.',
      name: 'hover?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    focus: {
      control: 'boolean',
      description: 'Forces focus style for preview.',
      name: 'focus?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'boolean',
      description: 'Shows label row.',
      name: 'label?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    labelText: {
      control: 'text',
      description: 'Label content.',
    },
    required: {
      control: 'boolean',
      description: 'Shows required asterisk.',
      name: 'required?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    labelIcon: {
      control: 'boolean',
      description: 'Shows label icon.',
      name: 'labelIcon?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'left'],
      description: 'Label placement.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text.',
    },
    showHelperText: {
      control: 'boolean',
      description: 'Shows helper text row.',
      name: 'HelperText?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    helperText: {
      control: 'text',
      description: 'Helper text content.',
      if: { arg: 'showHelperText', truthy: true },
    },
    leftIcon: {
      control: 'boolean',
      description: 'Shows start icon.',
      name: 'leftIcon?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Shows end icon.',
      name: 'rightIcon?',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    inputType: { table: { disable: true } },
    startAdornment: { table: { disable: true } },
    endAdornment: { table: { disable: true } },
    className: { table: { disable: true } },
    id: { table: { disable: true } },
    style: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onInput: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Input key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['regular', 'success', 'error'] as const).map((type) => (
        <Input key={type} {...args} type={type} />
      ))}
    </div>
  ),
};

export const States: Story = {
  args: {
    type: 'regular',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input {...args} state="default" hover={false} focus={false} />
      <Input {...args} state="default" hover />
      <Input {...args} state="default" focus />
      <Input {...args} state="filled" hover={false} focus={false} />
      <Input {...args} state="filled" hover />
      <Input {...args} state="filled" focus />
      <Input {...args} state="disable" hover={false} focus={false} />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <Input {...args} labelPosition="top" />
      <Input {...args} labelPosition="left" />
    </div>
  ),
};

export const FocusByControlClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvasElement.querySelector('.pds-input__control');
    const input = canvas.getByPlaceholderText('Placeholder text');

    if (!control) {
      throw new Error('Input control was not found.');
    }

    await userEvent.click(control);
    await expect(input).toHaveFocus();
  },
};
