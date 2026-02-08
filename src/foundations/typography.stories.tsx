import type { Meta, StoryObj } from '@storybook/react';
import './foundations.css';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;

type Story = StoryObj;

const samples = [
  {
    label: 'Heading 1',
    style: {
      fontFamily: 'var(--pds-font-heading)',
      fontSize: 'var(--pds-text-3xl)',
      lineHeight: 'var(--pds-line-height-3xl)',
      fontWeight: 700,
    },
    text: 'Powerful, clean, and reliable',
  },
  {
    label: 'Heading 2',
    style: {
      fontFamily: 'var(--pds-font-heading)',
      fontSize: 'var(--pds-text-2xl)',
      lineHeight: 'var(--pds-line-height-2xl)',
      fontWeight: 600,
    },
    text: 'Design system components',
  },
  {
    label: 'Body',
    style: {
      fontFamily: 'var(--pds-font-body)',
      fontSize: 'var(--pds-text-md)',
      lineHeight: 'var(--pds-line-height-md)',
      fontWeight: 400,
    },
    text: 'Build consistent interfaces with purposeful spacing, typography, and motion.',
  },
  {
    label: 'Label',
    style: {
      fontFamily: 'var(--pds-font-body)',
      fontSize: 'var(--pds-text-sm)',
      lineHeight: 'var(--pds-line-height-sm)',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    text: 'LABEL TEXT',
  },
];

export const TypeScale: Story = {
  render: () => (
    <div className="pds-foundation-typography">
      {samples.map((sample) => (
        <div className="pds-foundation-typography__sample" key={sample.label}>
          <div className="pds-foundation-typography__label">{sample.label}</div>
          <div style={sample.style}>{sample.text}</div>
        </div>
      ))}
    </div>
  ),
};
