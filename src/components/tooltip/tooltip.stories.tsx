import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip } from './tooltip';

const triggerStyle: CSSProperties = {
  border: '1px solid #cfd8dc',
  borderRadius: 6,
  background: '#fff',
  color: '#263238',
  cursor: 'pointer',
  fontSize: 13,
  lineHeight: '20px',
  padding: '6px 10px',
};

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      include: ['content', 'size', 'color', 'type', 'placement', 'align', 'showDelay', 'hideDelay'],
    },
    docs: {
      description: {
        component: [
          'Accessible tooltip with trigger-based behavior (hover + focus) and Escape close.',
          '',
          'Do:',
          '- Use for brief helper text.',
          '- Keep text short (1-2 lines).',
          '- Pair with icons and compact controls.',
          '',
          "Don't:",
          '- Put interactive controls inside tooltip.',
          '- Use tooltip as a replacement for critical form guidance.',
          '- Show tooltip permanently for long content.',
          '',
          '```tsx',
          "import { Tooltip } from 'planet-design-system-v1';",
          '',
          '<Tooltip content="This is a tool tip">',
          '  <button>Hover me</button>',
          '</Tooltip>',
          '```',
        ].join('\n'),
      },
      canvas: { layout: 'centered', sourceState: 'none' },
    },
  },
  args: {
    content: 'This is a tool tip',
    size: 'sm',
    color: 'dark',
    type: 'regular',
    placement: 'top',
    align: 'center',
    showDelay: 120,
    hideDelay: 0,
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip text or node content.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Typography size of the tooltip content.',
      table: { defaultValue: { summary: 'sm' } },
    },
    color: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color theme for tooltip background and text.',
      table: { defaultValue: { summary: 'dark' } },
    },
    type: {
      control: 'select',
      options: ['regular', 'label'],
      description: 'Tooltip type. `label` hides the arrow.',
      table: { defaultValue: { summary: 'regular' } },
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side relative to trigger.',
      table: { defaultValue: { summary: 'top' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment along the selected side.',
      table: { defaultValue: { summary: 'center' } },
    },
    showDelay: {
      control: 'number',
      description: 'Delay before opening (ms).',
      table: { defaultValue: { summary: '120' } },
    },
    hideDelay: {
      control: 'number',
      description: 'Delay before closing (ms).',
      table: { defaultValue: { summary: '0' } },
    },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    children: { table: { disable: true } },
    tooltipClassName: { table: { disable: true } },
    maxWidth: { table: { disable: true } },
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" style={triggerStyle}>
        Hover or Focus me
      </button>
    </Tooltip>
  ),
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive matrix for all supported placement and alignment combinations.',
      },
    },
  },
  args: {
    content: 'This is a tool tip',
    size: 'md',
    color: 'dark',
    type: 'regular',
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => {
    const renderCell = (name: PreviewPlacement) => {
      const mapped = placementMap[name];

      return (
        <Tooltip
          key={name}
          content={args.content}
          size={args.size}
          color={args.color}
          type={args.type}
          showDelay={args.showDelay}
          hideDelay={args.hideDelay}
          placement={mapped.placement}
          align={mapped.align}
        >
          <button type="button" style={livePreviewButton}>
            {name}
          </button>
        </Tooltip>
      );
    };

    const slots: Array<{ name: PreviewPlacement; row: number; col: number }> = [
      { name: 'top-start', row: 1, col: 2 },
      { name: 'top', row: 1, col: 3 },
      { name: 'top-end', row: 1, col: 4 },
      { name: 'left-start', row: 2, col: 1 },
      { name: 'auto-start', row: 2, col: 3 },
      { name: 'right-start', row: 2, col: 5 },
      { name: 'left', row: 3, col: 1 },
      { name: 'auto', row: 3, col: 3 },
      { name: 'right', row: 3, col: 5 },
      { name: 'left-end', row: 4, col: 1 },
      { name: 'auto-end', row: 4, col: 3 },
      { name: 'right-end', row: 4, col: 5 },
      { name: 'bottom-start', row: 5, col: 2 },
      { name: 'bottom', row: 5, col: 3 },
      { name: 'bottom-end', row: 5, col: 4 },
    ];

    return (
      <div style={livePreviewContainer}>
        {slots.map((slot) => (
          <div key={slot.name} style={{ gridRow: slot.row, gridColumn: slot.col }}>
            {renderCell(slot.name)}
          </div>
        ))}
      </div>
    );
  },
};

export const Light: Story = {
  args: {
    color: 'light',
  },
};

export const Label: Story = {
  args: {
    type: 'label',
  },
};

export const Placements: Story = {
  render: (args) => {
    const placements = ['top', 'right', 'bottom', 'left'] as const;

    return (
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, max-content)' }}>
        {placements.map((placement) => (
          <Tooltip key={placement} {...args} placement={placement}>
            <button type="button" style={triggerStyle}>
              {placement}
            </button>
          </Tooltip>
        ))}
      </div>
    );
  },
};

export const Alignments: Story = {
  render: (args) => {
    const aligns = ['start', 'center', 'end'] as const;

    return (
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, max-content)' }}>
        {aligns.map((align) => (
          <Tooltip key={align} {...args} align={align} placement="top">
            <button type="button" style={triggerStyle}>
              {align}
            </button>
          </Tooltip>
        ))}
      </div>
    );
  },
};

export const StaticSurface: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Tooltip {...args} />
      <Tooltip {...args} color="light" />
      <Tooltip {...args} type="label" />
    </div>
  ),
};

const iconTriggerStyle: CSSProperties = {
  width: 34,
  height: 34,
  border: '1px solid #cfd8dc',
  borderRadius: 6,
  background: '#fff',
  color: '#455a64',
  fontSize: 18,
  lineHeight: '18px',
  cursor: 'pointer',
};

export const RealUsageIconTrigger: Story = {
  args: {
    content: 'More details',
    type: 'regular',
    color: 'dark',
    placement: 'top',
    align: 'center',
    showDelay: 80,
    hideDelay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" style={iconTriggerStyle} aria-label="Info">
        i
      </button>
    </Tooltip>
  ),
};

export const RealUsageTruncatedLabel: Story = {
  args: {
    content: 'Quarterly revenue projection for North America region',
    type: 'regular',
    color: 'dark',
    placement: 'top',
    align: 'center',
    showDelay: 80,
    hideDelay: 0,
  },
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <Tooltip {...args}>
        <button
          type="button"
          style={{
            ...triggerStyle,
            width: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
          }}
        >
          Quarterly revenue projection for North America region
        </button>
      </Tooltip>
    </div>
  ),
};

export const RealUsageFormHelp: Story = {
  args: {
    content: 'Must include at least 8 characters, one number, and one symbol.',
    type: 'regular',
    color: 'light',
    placement: 'right',
    align: 'center',
    showDelay: 80,
    hideDelay: 0,
  },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: 8,
        gridTemplateColumns: '180px max-content',
        alignItems: 'center',
      }}
    >
      <input
        type="password"
        aria-label="Password"
        placeholder="Password"
        style={{
          width: 180,
          border: '1px solid #cfd8dc',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 13,
          lineHeight: '20px',
        }}
      />
      <Tooltip {...args}>
        <button type="button" style={iconTriggerStyle} aria-label="Password help">
          ?
        </button>
      </Tooltip>
    </div>
  ),
};

export const InteractionHover: Story = {
  args: {
    content: 'Hover interaction tooltip',
    type: 'regular',
    color: 'dark',
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" style={triggerStyle}>
        Hover target
      </button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover target' });

    await userEvent.hover(trigger);
    const openTooltip = await within(document.body).findByRole('tooltip');
    await expect(openTooltip).toBeVisible();

    await userEvent.unhover(trigger);
    await waitFor(() => {
      const hiddenTooltip = within(document.body).queryByRole('tooltip');
      expect(hiddenTooltip).toBeNull();
    });
  },
};

export const InteractionFocusEscape: Story = {
  args: {
    content: 'Keyboard interaction tooltip',
    type: 'regular',
    color: 'dark',
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" style={triggerStyle}>
        Focus target
      </button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Focus target' });

    trigger.focus();
    const openTooltip = await within(document.body).findByRole('tooltip');
    await expect(openTooltip).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      const hiddenTooltip = within(document.body).queryByRole('tooltip');
      expect(hiddenTooltip).toBeNull();
    });
  },
};

export const LabelHasNoArrow: Story = {
  args: {
    content: 'Label tooltip',
    type: 'label',
    color: 'dark',
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button type="button" style={triggerStyle}>
        Label target
      </button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Label target' });
    await userEvent.hover(trigger);

    const openTooltip = await within(document.body).findByRole('tooltip');
    await expect(openTooltip).toBeVisible();
    await expect(openTooltip.querySelector('.pds-tooltip__arrow')).toBeNull();
  },
};

export const ViewportEdgeFallback: Story = {
  args: {
    content: 'Edge fallback tooltip',
    type: 'regular',
    color: 'dark',
    placement: 'right',
    align: 'start',
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => (
    <div style={{ width: 260, display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip {...args}>
        <button type="button" style={triggerStyle}>
          Edge target
        </button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Edge target' });
    await userEvent.hover(trigger);

    const openTooltip = await within(document.body).findByRole('tooltip');
    const rect = openTooltip.getBoundingClientRect();
    await expect(rect.left).toBeGreaterThanOrEqual(0);
    await expect(rect.top).toBeGreaterThanOrEqual(0);
    await expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    await expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
  },
};

type PreviewPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'auto-start'
  | 'auto'
  | 'auto-end';

const placementMap: Record<
  PreviewPlacement,
  { placement: 'top' | 'right' | 'bottom' | 'left'; align: 'start' | 'center' | 'end' }
> = {
  'top-start': { placement: 'top', align: 'start' },
  top: { placement: 'top', align: 'center' },
  'top-end': { placement: 'top', align: 'end' },
  'left-start': { placement: 'left', align: 'start' },
  left: { placement: 'left', align: 'center' },
  'left-end': { placement: 'left', align: 'end' },
  'right-start': { placement: 'right', align: 'start' },
  right: { placement: 'right', align: 'center' },
  'right-end': { placement: 'right', align: 'end' },
  'bottom-start': { placement: 'bottom', align: 'start' },
  bottom: { placement: 'bottom', align: 'center' },
  'bottom-end': { placement: 'bottom', align: 'end' },
  'auto-start': { placement: 'top', align: 'start' },
  auto: { placement: 'top', align: 'center' },
  'auto-end': { placement: 'top', align: 'end' },
};

const livePreviewContainer: CSSProperties = {
  width: '100%',
  maxWidth: 960,
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(5, max-content)',
  gridTemplateRows: 'repeat(5, max-content)',
  columnGap: 12,
  rowGap: 8,
  justifyContent: 'center',
  alignItems: 'center',
};

const livePreviewButton: CSSProperties = {
  ...triggerStyle,
  width: 100,
  height: 34,
  background: '#f7f7f7',
  color: '#555a60',
  fontSize: 14,
  lineHeight: '20px',
  borderRadius: 4,
};
