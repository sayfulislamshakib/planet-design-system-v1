import type { Meta, StoryObj } from '@storybook/react';
import './foundations.css';

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;

type Story = StoryObj;

const palettes = [
  { name: 'App Background', variable: '--pds-color-app-bg' },
  { name: 'Surface', variable: '--pds-color-surface' },
  { name: 'Surface 2', variable: '--pds-color-surface-2' },
  { name: 'Surface 3', variable: '--pds-color-surface-3' },
  { name: 'Text', variable: '--pds-color-text' },
  { name: 'Text Muted', variable: '--pds-color-text-muted' },
  { name: 'Text Subtle', variable: '--pds-color-text-subtle' },
  { name: 'Border', variable: '--pds-color-border' },
  { name: 'Primary', variable: '--pds-color-primary' },
  { name: 'Primary Soft', variable: '--pds-color-primary-soft' },
  { name: 'Success', variable: '--pds-color-success' },
  { name: 'Warning', variable: '--pds-color-warning' },
  { name: 'Danger', variable: '--pds-color-danger' },
  { name: 'Info', variable: '--pds-color-info' },
];

export const Palette: Story = {
  render: () => (
    <div className="pds-foundation-grid">
      {palettes.map((item) => (
        <div className="pds-foundation-swatch" key={item.variable}>
          <div
            className="pds-foundation-swatch__color"
            style={{ background: `var(${item.variable})` }}
          />
          <div className="pds-foundation-swatch__meta">
            <strong>{item.name}</strong>
            <span>{item.variable}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
