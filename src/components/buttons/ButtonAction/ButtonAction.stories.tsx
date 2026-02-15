import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonAction } from './ButtonAction';

const meta: Meta<typeof ButtonAction> = {
  title: 'Components/Buttons/Button Action',
  component: ButtonAction,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The button action component triggers an overflow or contextual menu.',
          '',
          '```tsx',
          "import { ButtonAction } from 'planet-design-system-v1';",
          '',
          '<ButtonAction aria-label="More actions" />',
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
  },
  args: {
    size: 'md',
    state: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'focus', 'pressed', 'disabled'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonAction>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <ButtonAction size="xs" aria-label="More actions xs" />
      <ButtonAction size="sm" aria-label="More actions sm" />
      <ButtonAction size="md" aria-label="More actions md" />
      <ButtonAction size="lg" aria-label="More actions lg" />
      <ButtonAction size="xl" aria-label="More actions xl" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(6, max-content)', alignItems: 'center' }}>
      <ButtonAction state="default" aria-label="More actions default" />
      <ButtonAction state="hover" aria-label="More actions hover" />
      <ButtonAction state="active" aria-label="More actions active" />
      <ButtonAction state="focus" aria-label="More actions focus" />
      <ButtonAction state="pressed" aria-label="More actions pressed" />
      <ButtonAction state="disabled" aria-label="More actions disabled" />
    </div>
  ),
};

export const Matrix: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const states = ['default', 'hover', 'active', 'focus', 'pressed', 'disabled'] as const;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {states.map((state) => (
          <div key={state} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, max-content)', gap: 16 }}>
            {sizes.map((size) => (
              <ButtonAction
                key={`${state}-${size}`}
                size={size}
                state={state}
                aria-label={`More actions ${state} ${size}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};
