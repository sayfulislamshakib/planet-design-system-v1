import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Controls, Description, Primary, Stories, Title } from '@storybook/addon-docs/blocks';
import { Overlay } from './overlay';
import type { OverlayProps } from './overlay';

const previewRoot: CSSProperties = {
  position: 'relative',
  width: 360,
  height: 220,
  overflow: 'hidden',
  background:
    'radial-gradient(circle at 15% 20%, #7cb342 0 22%, transparent 23%), radial-gradient(circle at 78% 75%, #ffb300 0 18%, transparent 19%), linear-gradient(140deg, #90caf9 0%, #26a69a 100%)',
};

const contentCard: CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  left: 16,
  zIndex: 2,
  padding: 12,
  borderRadius: 8,
  background: 'rgba(255,255,255,0.92)',
  color: '#263238',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  lineHeight: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};

const previewOverlay: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
};

type OverlayStoryArgs = Pick<OverlayProps, 'inverse' | 'blur'>;

const renderOverlayPreview = (args: OverlayStoryArgs) => (
  <div style={previewRoot}>
    <div style={contentCard}>
      Dialog host content
      <br />
      Background should be dimmed by overlay.
    </div>
    <Overlay {...args} style={previewOverlay} aria-label="Overlay preview" />
  </div>
);

const meta: Meta<typeof Overlay> = {
  title: 'Components/Overlay',
  component: Overlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'none',
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Primary of="story" />
          <Controls of="story" />
          <Stories includePrimary={false} />
        </>
      ),
      description: {
        component: [
          'Overlay layer used above app content for dialogs, drawers, and modal states.',
          'Use it as a non-interactive visual layer behind dialogs or side panels.',
          '',
          'Figma variants mapped:',
          '- `inverse=false`, `blur=false`',
          '- `inverse=false`, `blur=true`',
          '- `inverse=true`, `blur=false`',
          '- `inverse=true`, `blur=true`',
          '',
          '```tsx',
          "import { Overlay } from 'planet-design-system-v1';",
          '',
          '<div style={{ position: "fixed", inset: 0 }}>',
          '  <Overlay />',
          '</div>',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    inverse: false,
    blur: false,
  },
  argTypes: {
    inverse: {
      control: 'boolean',
      name: 'inverse?',
      description: 'Switches to light overlay color for dark surfaces.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    blur: {
      control: 'boolean',
      name: 'blur?',
      description: 'Adds backdrop blur behind the overlay.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    title: { table: { disable: true } },
    role: { table: { disable: true } },
    tabIndex: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Overlay>;

export const Playground: Story = {
  render: renderOverlayPreview,
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default dark overlay with 75% opacity and no blur.',
      },
    },
  },
  args: { inverse: false, blur: false },
  render: renderOverlayPreview,
};

export const Blur: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dark overlay with backdrop blur.',
      },
    },
  },
  args: { inverse: false, blur: true },
  render: renderOverlayPreview,
};

export const Inverse: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Light inverse overlay for dark UI backgrounds.',
      },
    },
  },
  args: { inverse: true, blur: false },
  render: renderOverlayPreview,
};

export const InverseBlur: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Light inverse overlay with backdrop blur.',
      },
    },
  },
  args: { inverse: true, blur: true },
  render: renderOverlayPreview,
};
